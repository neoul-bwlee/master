package com.neoulsoft.tcare.db.mapper;

import com.neoulsoft.tcare.vo.AgencyVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.Map;

@Mapper
public interface AgencyMapper {

    @Select({
            "<script>" +
                    "select * from tcare_agency " +
                    "where agencyCode = #{agencyCode} " +
                    "limit 0, 1" +
                    "</script>"
    })
    AgencyVO selectAgencyByCode(Map<String, Object> params) throws Exception;

}
