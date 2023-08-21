package com.neoulsoft.tcare.db.service;

import com.neoulsoft.tcare.ext.HandledServiceException;
import com.neoulsoft.tcare.db.mapper.UserMapper;
import com.neoulsoft.tcare.db.type.CryptoField;
import com.neoulsoft.tcare.vo.NAuthUserVO;
import com.neoulsoft.tcare.vo.UserVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service("userService")
public class UserService {

    @Autowired
    private UserMapper userMapper;

    public UserVO getUser(String username) throws HandledServiceException {
        try {
            if (!username.contains("@"))
                throw new HandledServiceException(400, "Invalid account format. [" + username + "]");

            String accountId = username.substring(0, username.lastIndexOf("@"));
            String clientId = username.substring(username.lastIndexOf("@") + 1);

            Map<String, Object> params = new HashMap<String, Object>();
            params.put("username", accountId);
            UserVO user = userMapper.selectUserByUsername(params);
            return user;
        } catch (Exception e) {
            throw new HandledServiceException(410, e.getMessage());
        }
    }

    public UserVO getUserByProvider(String username, String provider) throws HandledServiceException {
        try {
            Map<String, Object> params = new HashMap<String, Object>();
            params.put("username", username);
            params.put("provider", provider);
            UserVO user = userMapper.selectUserByProvider(params);
            return user;
        } catch (Exception e) {
            throw new HandledServiceException(410, e.getMessage());
        }
    }

    public UserVO getUserBySeq(CryptoField.NAuth uid) throws HandledServiceException {
        try {
            Map<String, Object> params = new HashMap<String, Object>();
            params.put("uid", uid);
            UserVO user = userMapper.selectUserBySeq(params);
            return user;
        } catch (Exception e) {
            throw new HandledServiceException(410, e.getMessage());
        }
    }

    public UserVO getUserByParams(Map<String, Object> params) throws HandledServiceException {
        try {
            UserVO user = userMapper.selectUserByParams(params);
            return user;
        } catch (Exception e) {
            throw new HandledServiceException(410, e.getMessage());
        }
    }

    @Transactional
    public void insertUser(UserVO user) throws HandledServiceException {
        try {
            userMapper.insertUser(user);
        } catch (Exception e) {
            throw new HandledServiceException(410, e.getMessage());
        }
    }

    @Transactional
    public void updateUser(UserVO user) throws HandledServiceException {
        try {
            userMapper.updateUser(user);
        } catch (Exception e) {
            throw new HandledServiceException(410, e.getMessage());
        }
    }

    @Transactional
    public void deleteUser(CryptoField.NAuth uid) throws HandledServiceException {
        try {
            Map<String, Object> params = new HashMap<>();
            params.put("uid", uid);
            userMapper.deleteUser(params);
        } catch (Exception e) {
            throw new HandledServiceException(410, e.getMessage());
        }
    }

    @Transactional
    public void insertAuthProvider(NAuthUserVO.AuthProvider authProvider) throws HandledServiceException {
        try {
            userMapper.insertAuthProvider(authProvider);
        } catch (Exception e) {
            throw new HandledServiceException(410, e.getMessage());
        }
    }

    @Transactional
    public void updateAuthProvider(String clientId, CryptoField.NAuth authUid, String provider, String providerId) throws HandledServiceException {
        try {
            Map<String, Object> params = new HashMap<>();
            params.put("clientId", clientId);
            params.put("provider", provider);
            params.put("providerId", providerId);
            params.put("authUid", authUid);
            userMapper.resetRecentlyUsed(params);
            userMapper.updateAuthProvider(params);
        } catch (Exception e) {
            throw new HandledServiceException(410, e.getMessage());
        }
    }

    public List<NAuthUserVO.AuthProvider> getAuthProviderList(CryptoField.NAuth authUid) throws  HandledServiceException {
        try {
            Map<String, Object> params = new HashMap<>();
            params.put("authUid", authUid);
            return userMapper.selectAuthProviderList(params);
        } catch (Exception e) {
            throw new HandledServiceException(410, e.getMessage());
        }
    }


    @Transactional
    public void deleteAuthProviders(CryptoField.NAuth uid) throws HandledServiceException {
        try {
            Map<String, Object> params = new HashMap<>();
            params.put("authUid", uid);
            userMapper.deleteAuthProviders(params);
        } catch (Exception e) {
            throw new HandledServiceException(410, e.getMessage());
        }
    }

}
