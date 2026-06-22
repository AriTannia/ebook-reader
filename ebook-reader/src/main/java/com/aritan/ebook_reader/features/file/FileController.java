package com.aritan.ebook_reader.features.file;

import com.aritan.ebook_reader.common.enums.AccessType;
import com.aritan.ebook_reader.common.models.EBResponse;
import com.aritan.ebook_reader.features.file.utilities.FileHelper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.method.annotation.StreamingResponseBody;
import software.amazon.awssdk.core.ResponseInputStream;
import software.amazon.awssdk.http.SdkHttpMethod;
import software.amazon.awssdk.services.s3.model.GetObjectResponse;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/public/files")
@RequiredArgsConstructor
public class FileController {
    private final IFileService fileService;

    @GetMapping("/{filename}")
    public ResponseEntity<String> getUrl(@PathVariable String filename) {
        String url = fileService.generatePresignedUrl(filename, SdkHttpMethod.GET, null);
        return ResponseEntity.ok(url);
    }

    @PostMapping("/pre-signed-url")
    public ResponseEntity<EBResponse<Map<String, Object>>> generateUrl(
            @RequestParam(name = "filename", required = false, defaultValue = "") String filename,
            @RequestParam(name = "accessType", required = false, defaultValue = "PRIVATE") AccessType accessType) {
        filename = FileHelper.buildFileName(filename);
        String url = fileService.generatePresignedUrl(filename, SdkHttpMethod.PUT, accessType);
        return ResponseEntity.ok(EBResponse.Success(Map.of("url", url, "filename", filename), "Pre-signed URL generated successfully"));
    }

    @PostMapping("/upload")
    public ResponseEntity<String> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam(name = "accessType", required = false, defaultValue = "PRIVATE") AccessType accessType) throws IOException {
        String fileName = fileService.uploadMultipartFile(file, accessType);
        return ResponseEntity.ok(EBResponse.Success(fileName, "File uploaded successfully").getData());
    }

    @SuppressWarnings("resource")
    @GetMapping("/download/{fileName}")
    public ResponseEntity<EBResponse<StreamingResponseBody>> downloadFile(@PathVariable("fileName") String fileName) throws Exception {
        ResponseInputStream<GetObjectResponse> s3InputStream = fileService.downloadFile(fileName);

        String eTag = s3InputStream.response().eTag();
        long contentLength = s3InputStream.response().contentLength();

        StreamingResponseBody responseBody = outputStream -> {
            try (s3InputStream) {
                byte[] buffer = new byte[8192];
                int bytesRead;
                while ((bytesRead = s3InputStream.read(buffer)) != -1) {
                    outputStream.write(buffer, 0, bytesRead);
                }
                outputStream.flush();
            }
        };

        EBResponse<StreamingResponseBody> ebResponse = EBResponse.Success(responseBody, null);

        HttpHeaders headers = new HttpHeaders();
        headers.set(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"");
        headers.setETag(eTag);

        return ResponseEntity.ok()
                .headers(headers)
                .contentLength(contentLength)
                .body(ebResponse);
    }
}
