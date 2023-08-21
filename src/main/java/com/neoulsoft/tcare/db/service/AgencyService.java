package com.neoulsoft.tcare.db.service;

import com.neoulsoft.tcare.db.mapper.AgencyMapper;
import com.neoulsoft.tcare.ext.HandledServiceException;
import com.neoulsoft.tcare.vo.AgencyVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service("agencyService")
public class AgencyService {

    @Autowired
    private AgencyMapper agencyMapper;

    public AgencyVO getAgencyByCode(String agencyCode) throws HandledServiceException {
        try {
            Map<String, Object> params = new HashMap<>();
            params.put("agencyCode", agencyCode);
            return agencyMapper.selectAgencyByCode(params);
        } catch(Exception e) {
            throw new HandledServiceException(410, e.getMessage());
        }
    }
}
