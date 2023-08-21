package com.neoulsoft.tcare.db.mapper;

import com.neoulsoft.tcare.db.type.CryptoField;
import com.neoulsoft.tcare.vo.NAuthUserVO;
import com.neoulsoft.tcare.vo.UserVO;
import org.apache.ibatis.annotations.*;

import java.util.List;
import java.util.Map;

@Mapper
public interface UserMapper {
    @Select({
            "<script>" +
                    "select a.* " +
                    "from tcare_user a " +
                    "where a.leftAt = 0 " +
                    "and a.accountLocked = 0 " +
                    "</script>"
    })
    List<UserVO> selectAllUsers() throws Exception;

    @Select({
            "<script>" +
                    "select a.* " +
                    "from tcare_user a " +
                    "where trim(lower(a.username)) = trim(lower(#{username})) " +
                    "limit 0, 1" +
                    "</script>"
    })
    UserVO selectUserByUsername(Map<String, Object> params) throws Exception;


    @Select({
            "<script>" +
                    "select a.* " +
                    "from tcare_user a " +
                    "where trim(lower(a.username)) = trim(lower(#{username})) " +
                    "and a.provider = #{provider} " +
                    "limit 0, 1" +
                    "</script>"
    })
    UserVO selectUserByProvider(Map<String, Object> params) throws Exception;

    @Select({
            "<script>" +
                    "select a.* " +
                    "from tcare_user a " +
                    "where a.uid = #{uid,javaType=java.lang.Long,jdbcType=BIGINT,typeHandler=CryptoField_NAuth} " +
                    "limit 0, 1" +
                    "</script>"})
    UserVO selectUserBySeq(Map<String, Object> params) throws Exception;

    @Select({
            "<script>" +
                    "select a.* " +
                    "from tcare_user a " +
                    "where trim(lower(a.username)) = trim(lower(#{username})) " +
                    "and a.password = #{password}" +
                    "limit 0, 1" +
                    "</script>"})
    UserVO selectUserByParams(Map<String, Object> params) throws Exception;

    @Insert({
            "<script>" +
                    "insert into tcare_user (" +
                    "uid, userType, username, password, accountLocked, accountName, provider," +
                    "joinedAt, leftAt, email, profileUrl, phoneNumber, " +
                    "privacyTermsReadAt, serviceTermsReadAt, pushToken, usePush, " +
                    "tempPassword, tempPasswordExpire,deviceOsType" +
                    ") values (" +
                    "#{uid,javaType=java.lang.Long,jdbcType=BIGINT,typeHandler=CryptoField_NAuth}" +
                    ",#{userType,javaType=java.lang.Integer,jdbcType=TINYINT,typeHandler=UserType}" +
                    ",#{username}" +
                    ",#{password}" +
                    ",#{accountLocked}" +
                    ",#{accountName,javaType=java.lang.String,jdbcType=VARCHAR,typeHandler=String64}" +
                    ",#{provider}" +
                    ",#{joinedAt,javaType=java.lang.Long,jdbcType=BIGINT,typeHandler=LongDate}" +
                    ",#{leftAt,javaType=java.lang.Long,jdbcType=BIGINT,typeHandler=LongDate}" +
                    ",#{email}" +
                    ",#{profileUrl}" +
                    ",#{phoneNumber}" +
                    ",#{privacyTermsReadAt,javaType=java.lang.Long,jdbcType=BIGINT,typeHandler=LongDate}" +
                    ",#{serviceTermsReadAt,javaType=java.lang.Long,jdbcType=BIGINT,typeHandler=LongDate}" +
                    ",#{pushToken}" +
                    ",#{usePush}" +
                    ",#{tempPassword}" +
                    ",#{tempPasswordExpire,javaType=java.lang.Long,jdbcType=BIGINT,typeHandler=LongDate}" +
                    ",#{deviceOsType}" +
                    ")" +
                    "</script>"
    })
    void insertUser(UserVO user) throws Exception;


    @Update({
            "<script>" +
                    "update tcare_user set " +
                    " accountName = #{accountName,javaType=java.lang.String,jdbcType=VARCHAR,typeHandler=String64} " +
                    ",accountLocked = #{accountLocked}" +
                    "<if test='@com.neoulsoft.tcare.db.type.MybatisEmptyChecker@isNotEmpty(password)'>" +
                    ",password = #{password} " +
                    "</if> " +
                    ",userType = #{userType,javaType=java.lang.Integer,jdbcType=TINYINT,typeHandler=UserType}" +
                    ",leftAt = #{leftAt,javaType=java.lang.Long,jdbcType=BIGINT,typeHandler=LongDate}" +
                    ",email = #{email}" +
                    ",profileUrl = #{profileUrl}" +
                    ",phoneNumber = #{phoneNumber}" +
                    ",privacyTermsReadAt = #{privacyTermsReadAt,javaType=java.lang.Long,jdbcType=BIGINT,typeHandler=LongDate}" +
                    ",serviceTermsReadAt = #{serviceTermsReadAt,javaType=java.lang.Long,jdbcType=BIGINT,typeHandler=LongDate}" +
                    ",pushToken = #{pushToken}" +
                    ",usePush = #{usePush}" +
                    ",deviceOsType = #{deviceOsType}" +
                    "<if test='@com.neoulsoft.tcare.db.type.MybatisEmptyChecker@isNotEmpty(tempPassword)'>" +
                    ",tempPassword = #{tempPassword} " +
                    "</if> " +
                    ",tempPasswordExpire = #{tempPasswordExpire,javaType=java.lang.Long,jdbcType=BIGINT,typeHandler=LongDate} " +
                    " where uid = #{uid,javaType=java.lang.Long,jdbcType=BIGINT,typeHandler=CryptoField_NAuth} " +
                    "</script>"})
    void updateUser(UserVO user) throws Exception;

    @Delete({
            "<script>" +
                    "delete from tcare_user " +
                    "where uid = #{uid,javaType=java.lang.Long,jdbcType=BIGINT,typeHandler=CryptoField_NAuth} " +
                    "</script>"
    })
    void deleteUser(Map<String, Object> params) throws Exception;

    @Insert({
            "<script>" +
                    "insert into tcare_auth_provider (" +
                    "authUid,provider,providerPayload,authorizedAt,providerId,recentlyUsed" +
                    ") values (" +
                    "#{authUid,javaType=java.lang.Long,jdbcType=BIGINT,typeHandler=CryptoField_NAuth}" +
                    ",#{provider}" +
                    ",#{providerPayload}" +
                    ",#{authorizedAt,javaType=java.lang.Long,jdbcType=BIGINT,typeHandler=LongDate}" +
                    ",#{providerId}" +
                    ",#{recentlyUsed}" +
                    ")" +
                    "</script>"
    })
    @SelectKey(before = false, keyColumn = "seq", keyProperty = "seq",
            resultType = CryptoField.NAuth.class,
            statement = "SELECT last_insert_id() FROM tcare_auth_provider LIMIT 0, 1")
    void insertAuthProvider(NAuthUserVO.AuthProvider authProvider) throws Exception;

    @Update({
            "<script>" +
                    " update tcare_auth_provider set " +
                    " recentlyUsed = #{recentlyUsed} " +
                    " where provider = #{provider} " +
                    " and providerId = #{providerId} " +
                    " and clientId = #{clientId} " +
                    " and authUid = #{authUid,javaType=java.lang.Long,jdbcType=BIGINT,typeHandler=CryptoField_NAuth} " +
                    "</script>"
    })
    void updateAuthProvider(Map<String, Object> params) throws Exception;

    @Update({
            "<script>" +
                    " update tcare_auth_provider set " +
                    " recentlyUsed = 0 " +
                    " where authUid = #{authUid,javaType=java.lang.Long,jdbcType=BIGINT,typeHandler=CryptoField_NAuth} " +
                    "</script>"
    })
    void resetRecentlyUsed(Map<String, Object> params) throws Exception;

    @Select({
            "<script>" +
                    "select * from tcare_auth_provider " +
                    "where authUid = #{authUid,javaType=java.lang.Long,jdbcType=BIGINT,typeHandler=CryptoField_NAuth} " +
                    "order by recentlyUsed desc" +
                    "</script>"
    })
    List<NAuthUserVO.AuthProvider> selectAuthProviderList(Map<String, Object> params) throws Exception;


    @Delete({
            "<script>" +
                    "delete from tcare_auth_provider " +
                    "where authUid = #{authUid,javaType=java.lang.Long,jdbcType=BIGINT,typeHandler=CryptoField_NAuth} " +
                    "</script>"
    })
    void deleteAuthProviders(Map<String, Object> params) throws Exception;


}
