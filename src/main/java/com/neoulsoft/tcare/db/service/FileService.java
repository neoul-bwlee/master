package com.neoulsoft.tcare.db.service;

import com.neoulsoft.tcare.ext.HandledServiceException;
import com.neoulsoft.tcare.vo.FileVO;
import com.neoulsoft.tcare.db.mapper.FileMapper;
import com.neoulsoft.tcare.db.type.CryptoField;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service("fileService")
public class FileService {

    @Autowired
    private FileMapper fileMapper;

    public List<FileVO> getAllFiles() throws HandledServiceException {
        try {
            return fileMapper.selectAllFileList();
        } catch(Exception ex) {
            throw new HandledServiceException(410, ex.getMessage());
        }
    }

    public FileVO getFileBySeq(CryptoField fileSeq) throws HandledServiceException {
        try {
            Map<String, Object> params = new HashMap<>();
            params.put("fileSeq", fileSeq);
            return fileMapper.selectFileBySeq(params);
        } catch(Exception ex) {
            throw new HandledServiceException(410, ex.getMessage());
        }
    }

    @Transactional
    public void insertFile(FileVO file) throws HandledServiceException {
        try {
            fileMapper.insertFile(file);
        } catch(Exception ex) {
            throw new HandledServiceException(410, ex.getMessage());
        }
    }

    @Transactional
    public void updateFile(FileVO file) throws HandledServiceException {
        try {
            fileMapper.updateFile(file);
        } catch(Exception ex) {
            throw new HandledServiceException(410, ex.getMessage());
        }
    }

    @Transactional
    public void deleteFileSingle(CryptoField seq) throws HandledServiceException {
        try {
            Map<String, Object> params = new HashMap<>();
            params.put("seq", seq);
            fileMapper.deleteFileSingle(params);
        } catch(Exception ex) {
            throw new HandledServiceException(410, ex.getMessage());
        }
    }
}
