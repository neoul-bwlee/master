package com.neoulsoft.tcare.config;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.neoulsoft.tcare.db.type.*;
import com.neoulsoft.tcare.security.HmacPasswordEncoder;
import org.apache.commons.codec.binary.Hex;
import org.springframework.security.crypto.password.PasswordEncoder;

import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import java.text.NumberFormat;
import java.util.regex.Pattern;

public class ServerConstants {
    public static final String CONTEXT = "tcare";
    public static final String SERVICE_NAME = "tcare";

    public static final String SERVER_SECRET = "95c95e9b-0e47-4d8e-b868-51ce439572dc";
    public static final String ENV_SECRET = "1dfe8425c1c9d1e79ff38a378ffb68415acb623f7c1b3540e74900faa6690aa6";

    public static final String NAUTH_SECRET = "602dab6f-bdbc-43bb-9708-11341d7adb49";
    public static final String NAUTH_ENV_SECRET = "f2d3fa9e26d9e01376a3af87bf58f748";

    public static final String DEFAULT_FORMAT = "yyyy-MM-dd HH:mm:ss";
    public static final String WELL_FORMED_DATETIME = "yyyy-MM-dd HH:mm:ss";

    public static final String NOCHAR_FORMAT = "yyyyMMddHHmmss";

    public static final NumberFormat CURRENCY = NumberFormat.getInstance();

    public static Gson GSON = null;
    public static final String GOTG_CONTRACT = "0xceEB07Dd26b36287B6d109f0b06d7e8202Ce8c1D";
    public static final String MASTER_ADDRESS = "0x01839a2765238051973e06bf65f3e618e9c66a5e";

    public static final Pattern DATE_PATTERN = Pattern.compile(
            "^((2000|2400|2800|(19|2[0-9](0[48]|[2468][048]|[13579][26])))-?02-?29)$"
                    + "|^(((19|2[0-9])[0-9]{2})-?02-?(0[1-9]|1[0-9]|2[0-8]))$"
                    + "|^(((19|2[0-9])[0-9]{2})-?(0[13578]|10|12)-?(0[1-9]|[12][0-9]|3[01]))$"
                    + "|^(((19|2[0-9])[0-9]{2})-?(0[469]|11)-?(0[1-9]|[12][0-9]|30))$");

    public static final PasswordEncoder PASSWORD_ENCODER;

    static {
        CURRENCY.setMaximumIntegerDigits(16);
        CURRENCY.setMaximumFractionDigits(0);

        GSON = new GsonBuilder()
                .registerTypeHierarchyAdapter(String64.class,
                        new String64TypeAdapter())
                .registerTypeHierarchyAdapter(LongDate.class,
                        new LongDateTypeAdapter())
                .registerTypeHierarchyAdapter(CryptoField.class,
                        new CryptoFieldTypeAdapter())
                .registerTypeHierarchyAdapter(UserType.class,
                        new UserTypeTypeAdapter())
                .registerTypeHierarchyAdapter(CryptoField.NAuth.class,
                        new CryptoFieldNAuthTypeAdapter())
                .registerTypeHierarchyAdapter(UserType.NAuth.class,
                        new UserTypeNAuthTypeAdapter())
                .disableHtmlEscaping().create();

        PASSWORD_ENCODER = new HmacPasswordEncoder(NAUTH_SECRET);
    }
/*
    public static void main(String[] args) {
    }
*/
    public static void main(String[] args) {
        try {
            KeyGenerator keygen = KeyGenerator.getInstance("AES");
            keygen.init(256);
            SecretKey secret = keygen.generateKey();
            String secretKey = Hex.encodeHexString(secret.getEncoded());
            System.out.println(secretKey);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

}
