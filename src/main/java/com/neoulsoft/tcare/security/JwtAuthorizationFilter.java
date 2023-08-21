package com.neoulsoft.tcare.security;

import com.neoulsoft.tcare.TCareWebApplication;
import com.neoulsoft.tcare.config.ServerConstants;
import com.neoulsoft.tcare.ext.HandledServiceException;
import com.neoulsoft.tcare.ext.ResponseHelper;
import com.neoulsoft.tcare.vo.ResponseVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class JwtAuthorizationFilter extends BasicAuthenticationFilter {

    @Autowired
    private TokenAuthenticationService tokenAuthenticationService;

    public JwtAuthorizationFilter(AuthenticationManager authenticationManager) {
        super(authenticationManager);
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain chain) throws IOException, ServletException {
        String header = request.getHeader("Authorization");

        if (header == null || (!header.startsWith("Bearer") && !header.startsWith("bearer"))) {
            chain.doFilter(request, response);
            return;
        }

        if (SkipAuthenticationHelper.isSkipAuthentication(request) == true) {
            chain.doFilter(request, response);
            return;
        }

        UsernamePasswordAuthenticationToken authentication = null;
        try {
            authentication = getAuthentication(request);
            SecurityContextHolder.getContext().setAuthentication(authentication);
            chain.doFilter(request, response);
        } catch (HandledServiceException e) {
            ResponseVO errorResponse = ResponseHelper.error(401, e.getMessage());
            response.setStatus(401);
            response.setHeader("Content-Type", "application/json; charset=UTF-8");
            response.getWriter().write(ServerConstants.GSON.toJson(errorResponse));
        } catch (JwtAuthenticationException jae) {
            ResponseVO errorResponse = ResponseHelper.error(401, jae.getMessage());
            response.setStatus(401);
            response.setHeader("Content-Type", "application/json; charset=UTF-8");
            response.getWriter().write(ServerConstants.GSON.toJson(errorResponse));
        }
    }

    private UsernamePasswordAuthenticationToken getAuthentication(HttpServletRequest request)
            throws HandledServiceException {
        if (tokenAuthenticationService == null) {
            tokenAuthenticationService = TCareWebApplication.global
                    .getBean(TokenAuthenticationService.class);
        }
        return (UsernamePasswordAuthenticationToken) tokenAuthenticationService
                .getAuthentication(request);
    }

}
