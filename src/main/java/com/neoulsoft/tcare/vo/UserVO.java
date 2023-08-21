package com.neoulsoft.tcare.vo;

import com.neoulsoft.tcare.db.type.CryptoField;
import com.neoulsoft.tcare.db.type.LongDate;
import com.neoulsoft.tcare.db.type.UserType;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.Arrays;
import java.util.Collection;

@Data
@EqualsAndHashCode(callSuper = false)
public class UserVO extends NAuthUserVO {
    private UserType userType;
    private LongDate joinedAt;
    private LongDate leftAt;
    private String email;
    private String profileUrl;
    private String phoneNumber;
    private transient LongDate privacyTermsReadAt;
    private transient LongDate serviceTermsReadAt;
    private transient String pushToken;
    private boolean usePush;
    private String deviceOsType;

    private transient String tempPassword;
    private transient LongDate tempPasswordExpire;

    private AgencyVO agencyInfo;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        SimpleGrantedAuthority sga = new SimpleGrantedAuthority(getRole());
        return Arrays.asList(sga);
    }

    @Data
    public static class Simple {
        private CryptoField.NAuth uid;
        private String profileUrl;
        private String phoneNumber;
    }

    public Simple getSimple() {
        Simple simple = new Simple();
        simple.setUid(uid);
        simple.setProfileUrl(profileUrl);
        simple.setPhoneNumber(phoneNumber);
        return simple;
    }
}
