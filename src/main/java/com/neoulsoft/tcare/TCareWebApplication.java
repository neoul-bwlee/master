package com.neoulsoft.tcare;

import com.neoulsoft.tcare.config.ServerConstants;
import com.neoulsoft.tcare.db.type.*;
import com.neoulsoft.tcare.ext.HandledServiceException;
import com.neoulsoft.tcare.ext.LoggingRequestInterceptor;
import com.neoulsoft.tcare.vo.ResponseVO;
import lombok.SneakyThrows;
import net.javacrumbs.shedlock.core.LockProvider;
import net.javacrumbs.shedlock.provider.jdbctemplate.JdbcTemplateLockProvider;
import org.apache.catalina.Context;
import org.apache.catalina.webresources.StandardRoot;
import org.apache.http.HeaderElement;
import org.apache.http.HeaderElementIterator;
import org.apache.http.HttpResponse;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.config.Registry;
import org.apache.http.config.RegistryBuilder;
import org.apache.http.conn.ConnectionKeepAliveStrategy;
import org.apache.http.conn.socket.ConnectionSocketFactory;
import org.apache.http.conn.socket.PlainConnectionSocketFactory;
import org.apache.http.conn.ssl.NoopHostnameVerifier;
import org.apache.http.conn.ssl.SSLConnectionSocketFactory;
import org.apache.http.conn.ssl.TrustSelfSignedStrategy;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.impl.conn.PoolingHttpClientConnectionManager;
import org.apache.http.message.BasicHeaderElementIterator;
import org.apache.http.protocol.HTTP;
import org.apache.http.protocol.HttpContext;
import org.apache.http.ssl.SSLContextBuilder;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.type.TypeHandler;
import org.mybatis.spring.SqlSessionFactoryBean;
import org.mybatis.spring.annotation.MapperScan;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.embedded.tomcat.TomcatServletWebServerFactory;
import org.springframework.boot.web.servlet.server.ServletWebServerFactory;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.PropertySource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.client.BufferingClientHttpRequestFactory;
import org.springframework.http.client.ClientHttpRequestInterceptor;
import org.springframework.http.client.ClientHttpResponse;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.http.converter.FormHttpMessageConverter;
import org.springframework.http.converter.json.GsonHttpMessageConverter;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.client.ResponseErrorHandler;
import org.springframework.web.client.RestTemplate;

import javax.sql.DataSource;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.security.KeyManagementException;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.util.*;
import java.util.concurrent.TimeUnit;

import static org.springframework.http.HttpStatus.Series.CLIENT_ERROR;
import static org.springframework.http.HttpStatus.Series.SERVER_ERROR;

@EnableAsync
@EnableCaching
@Component("application")
@PropertySource("classpath:application.properties")
@MapperScan("com.neoulsoft.tcare.db.mapper")
@SpringBootApplication
@EnableScheduling
public class TCareWebApplication {
    private static final Logger logger = LoggerFactory.getLogger(TCareWebApplication.class);

    // Determines the timeout in milliseconds until a connection is established.
    private static final int CONNECT_TIMEOUT = 30000;

    // The timeout when requesting a connection from the connection manager.
    private static final int REQUEST_TIMEOUT = 30000;

    // The timeout for waiting for data
    private static final int SOCKET_TIMEOUT = 60000;

    private static final int MAX_TOTAL_CONNECTIONS = 50;
    private static final int DEFAULT_KEEP_ALIVE_TIME_MILLIS = 20 * 1000;
    private static final int CLOSE_IDLE_CONNECTION_WAIT_TIME_SECS = 30;

    public static ConfigurableApplicationContext global;

    public static void main(String[] args) {
        global = SpringApplication.run(TCareWebApplication.class, args);
    }

    @Bean
    public LockProvider lockProvider(DataSource dataSource) {
        return new JdbcTemplateLockProvider(dataSource);
    }

    @Bean
    public PoolingHttpClientConnectionManager poolingConnectionManager() {
        SSLContextBuilder builder = new SSLContextBuilder();
        try {
            builder.loadTrustMaterial(null, new TrustSelfSignedStrategy());
        } catch (NoSuchAlgorithmException | KeyStoreException e) {
            logger.error("Pooling Connection Manager Initialisation failure because of " + e.getMessage(), e);
        }

        SSLConnectionSocketFactory sslsf = null;
        try {
            sslsf = new SSLConnectionSocketFactory(builder.build());
        } catch (KeyManagementException | NoSuchAlgorithmException e) {
            logger.error("Pooling Connection Manager Initialisation failure because of " + e.getMessage(), e);
        }

        Registry<ConnectionSocketFactory> socketFactoryRegistry = RegistryBuilder
                .<ConnectionSocketFactory>create().register("https", sslsf)
                .register("http", new PlainConnectionSocketFactory())
                .build();

        PoolingHttpClientConnectionManager poolingConnectionManager = new PoolingHttpClientConnectionManager(socketFactoryRegistry);
        poolingConnectionManager.setMaxTotal(MAX_TOTAL_CONNECTIONS);
        return poolingConnectionManager;
    }

    @Bean
    public ConnectionKeepAliveStrategy connectionKeepAliveStrategy() {
        return new ConnectionKeepAliveStrategy() {
            @Override
            public long getKeepAliveDuration(HttpResponse response, HttpContext context) {
                HeaderElementIterator it = new BasicHeaderElementIterator
                        (response.headerIterator(HTTP.CONN_KEEP_ALIVE));
                while (it.hasNext()) {
                    HeaderElement he = it.nextElement();
                    String param = he.getName();
                    String value = he.getValue();

                    if (value != null && param.equalsIgnoreCase("timeout")) {
                        return Long.parseLong(value) * 1000;
                    }
                }
                return DEFAULT_KEEP_ALIVE_TIME_MILLIS;
            }
        };
    }

    @Bean
    public Runnable idleConnectionMonitor(final PoolingHttpClientConnectionManager connectionManager) {
        return new Runnable() {
            @Override
            @Scheduled(fixedDelay = 10000)
            public void run() {
                try {
                    if (connectionManager != null) {
                        logger.trace("run IdleConnectionMonitor - Closing expired and idle connections...");
                        connectionManager.closeExpiredConnections();
                        connectionManager.closeIdleConnections(CLOSE_IDLE_CONNECTION_WAIT_TIME_SECS, TimeUnit.SECONDS);
                    } else {
                        logger.trace("run IdleConnectionMonitor - Http Client Connection manager is not initialised");
                    }
                } catch (Exception e) {
                    logger.error("run IdleConnectionMonitor - Exception occurred. msg={}, e={}", e.getMessage(), e);
                }
            }
        };
    }

    @Bean
    public RestTemplate restTemplate() {
        RequestConfig requestConfig = RequestConfig.custom()
                .setConnectionRequestTimeout(REQUEST_TIMEOUT)
                .setConnectTimeout(CONNECT_TIMEOUT)
                .setSocketTimeout(SOCKET_TIMEOUT).build();

        CloseableHttpClient httpClient
                = HttpClients.custom()
                .setDefaultRequestConfig(requestConfig)
                .setConnectionManager(poolingConnectionManager())
                .setKeepAliveStrategy(connectionKeepAliveStrategy())
                .setSSLHostnameVerifier(new NoopHostnameVerifier())
                .build();
        HttpComponentsClientHttpRequestFactory requestFactory
                = new HttpComponentsClientHttpRequestFactory();
        requestFactory.setHttpClient(httpClient);

        RestTemplate restTemplate = new RestTemplate(new BufferingClientHttpRequestFactory(
                requestFactory));
        restTemplate.setErrorHandler(new ResponseErrorHandler() {
            @Override
            public boolean hasError(ClientHttpResponse response) throws IOException {
                return (response.getStatusCode().series() == CLIENT_ERROR
                        || response.getStatusCode().series() == SERVER_ERROR);
            }

            @SneakyThrows
            @Override
            public void handleError(ClientHttpResponse response) throws IOException {
                if (response.getStatusCode().series() == HttpStatus.Series.SERVER_ERROR) {
                    // handle SERVER_ERROR
                } else if (response.getStatusCode().series() == HttpStatus.Series.CLIENT_ERROR) {
                    String responseText = null;
                    try (Scanner scanner = new Scanner(response.getBody(), StandardCharsets.UTF_8.name())) {
                        responseText = scanner.useDelimiter("\\A").next();
                    }
                    ResponseVO respError = ServerConstants.GSON.fromJson(responseText, ResponseVO.class);
                    String respErrorMessage = "";
                    if (respError.getMessage() instanceof String)
                        respErrorMessage = (String) respError.getMessage();
                    else if (respError.getMessage() instanceof String64)
                        respErrorMessage = ((String64) respError.getMessage()).originOf();
                    throw new HandledServiceException(respError.getCode(), respErrorMessage);
                }
            }
        });

        MappingJackson2HttpMessageConverter converter = new MappingJackson2HttpMessageConverter();
        converter.setSupportedMediaTypes(Collections.singletonList(MediaType.TEXT_HTML));

        FormHttpMessageConverter formConverter = new FormHttpMessageConverter();
        formConverter.setSupportedMediaTypes(Collections.singletonList(MediaType.APPLICATION_FORM_URLENCODED));

        List<ClientHttpRequestInterceptor> interceptors = new ArrayList<ClientHttpRequestInterceptor>();
        interceptors.add(new LoggingRequestInterceptor());
        restTemplate.setInterceptors(interceptors);
        restTemplate.setMessageConverters(Arrays.asList(gsonHttpMessageConverter(), converter, formConverter));

        return restTemplate;
    }

    @Bean
    public GsonHttpMessageConverter gsonHttpMessageConverter() {
        GsonHttpMessageConverter converter = new GsonHttpMessageConverter();
        converter.setGson(ServerConstants.GSON);
        return converter;
    }


    @Bean
    public SqlSessionFactory sqlSessionFactory(DataSource dataSource) throws Exception {
        SqlSessionFactoryBean sqlSessionFactoryBean = new SqlSessionFactoryBean();
        sqlSessionFactoryBean.setDataSource(dataSource);

        sqlSessionFactoryBean.setTypeHandlers(
                new TypeHandler[]{new LongDateTypeHandler(), new String64TypeHandler(),
                        new CryptoFieldTypeHandler(), new CryptoFieldNAuthTypeHandler(),
                        new UserTypeTypeHandler(),
                });

        sqlSessionFactoryBean
                .setTypeAliases(new Class[]{LongDateTypeHandler.class, String64TypeHandler.class,
                        CryptoFieldTypeHandler.class, CryptoFieldNAuthTypeHandler.class,
                        UserTypeTypeHandler.class,
                });

        return sqlSessionFactoryBean.getObject();
    }

    @Bean
    public DataSourceTransactionManager transactionManager(DataSource dataSource) {
        return new DataSourceTransactionManager(dataSource);
    }

    @Bean
    public ServletWebServerFactory servletContainer() {
        TomcatServletWebServerFactory tomcatFactory = new TomcatServletWebServerFactory() {
            @Override
            protected void postProcessContext(Context context) {
                final int cacheSize = 2 * 1024 * 1024;
                StandardRoot standardRoot = new StandardRoot(context);
                standardRoot.setCacheMaxSize(cacheSize);
                context.setResources(standardRoot); // This is what made it work in my case.
                logger.info(String.format("New cache size (KB): %d", context.getResources().getCacheMaxSize()));
            }
        };
        return tomcatFactory;
    }
}
