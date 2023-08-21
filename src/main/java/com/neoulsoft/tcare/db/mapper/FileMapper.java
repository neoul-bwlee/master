package com.neoulsoft.tcare.db.mapper;

import com.neoulsoft.tcare.db.type.CryptoField;
import com.neoulsoft.tcare.vo.FileVO;
import org.apache.ibatis.annotations.*;

import java.util.List;
import java.util.Map;

@Mapper
public interface FileMapper {

    @Select({
            "<script>" +
                    "select * from tcare_files " +
                    "order by seq asc" +
                    "</script>"
    })
    List<FileVO> selectAllFileList() throws Exception;

    // 파일 정보 가져오기
    @Select({
            "<script>" +
                    "select * from tcare_files " +
                    "where seq = #{fileSeq,javaType=java.lang.Long,jdbcType=BIGINT,typeHandler=CryptoField} " +
                    "limit 0, 1" +
                    "</script>"
    })
    FileVO selectFileBySeq(Map<String, Object> params) throws Exception;

    // 파일 저장하기
    @Insert({
            "<script>" +
                    "insert into tcare_files (" +
                    "fileName,fileExt,fileSize," +
                    "mimeType,fileUrl,originUrl,registeredAt" +
                    ") values (" +
                    "#{fileName,javaType=java.lang.String,jdbcType=VARCHAR,typeHandler=String64}" +
                    ",#{fileExt,javaType=java.lang.String,jdbcType=VARCHAR,typeHandler=String64}" +
                    ",#{fileSize}" +
                    ",#{mimeType}" +
                    ",#{fileUrl}" +
                    ",#{originUrl}" +
                    ",#{registeredAt,javaType=java.lang.Long,jdbcType=BIGINT,typeHandler=LongDate}" +
                    ")" +
                    "</script>"
    })
    @SelectKey(before = false, keyColumn = "seq", keyProperty = "seq",
            resultType = CryptoField.class,
            statement = "SELECT last_insert_id() FROM tcare_files LIMIT 0, 1")
    void insertFile(FileVO file) throws Exception;

    // 파일 정보 수정하기
    @Update({
            "<script>" +
                    " update tcare_files set " +
                    " fileName = #{fileName,javaType=java.lang.String,jdbcType=VARCHAR,typeHandler=String64}" +
                    ",fileExt = #{fileExt,javaType=java.lang.String,jdbcType=VARCHAR,typeHandler=String64}" +
                    ",fileSize = #{fileSize}" +
                    ",mimeType = #{mimeType}" +
                    ",fileUrl = #{fileUrl}" +
                    ",originUrl = #{originUrl}" +
                    " where seq = #{seq,javaType=java.lang.Long,jdbcType=BIGINT,typeHandler=CryptoField}" +
                    "</script>"
    })
    void updateFile(FileVO file) throws Exception;

    // 파일 삭제하기
    @Delete({
            "<script>" +
                    "delete from tcare_files " +
                    "where seq = #{seq,javaType=java.lang.Long,jdbcType=BIGINT,typeHandler=CryptoField}" +
                    "</script>"
    })
    void deleteFileSingle(Map<String, Object> params) throws Exception;

}
