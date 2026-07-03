package com.aritan.ebook_reader.config.security.jwt.utilities;

import com.aritan.ebook_reader.common.models.user.User;
import com.aritan.ebook_reader.config.security.jwt.services.UserDetailsImpl;
import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.util.WebUtils;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtUtils {
    private static final Logger logger = LoggerFactory.getLogger(JwtUtils.class);

    @Value("${ebook-reader.app.jwtSecret}")
    private String jwtSecret;

    @Value("${ebook-reader.app.jwtExpirationMs}")
    private int jwtExpirationMs;

    @Value("${ebook-reader.app.jwtCookieName}")
    private String jwtCookie;

    @Value("${ebook-reader.app.jwtRefreshCookieName}")
    private String jwtRefreshCookie;

    private SecretKey key() {
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtSecret));
    }

    //region Generate a cookie containing a token
    public ResponseCookie generateJwtCookie(UserDetailsImpl userPrincipal){
        String jwt = generateTokenFromUserName(userPrincipal.getUsername());
        return generateCookie(jwtCookie, jwt, "/api");
    }

    public ResponseCookie generateJwtCookie(User user){
        String jwt = generateTokenFromUserName(user.getEmail());
        return generateCookie(jwtCookie, jwt, "/api");
    }

    public ResponseCookie generateRefreshJwtCookie(String refreshToken){
        return generateCookie(jwtRefreshCookie, refreshToken, "/api/v1/auth/refresh-token");
    }
    //endregion

    //region Read cookie from token
    public String getJwtFromCookies(HttpServletRequest request){
        return getCookieValueByName(request, jwtCookie);
    }

    public String getJwtRefreshFromCookies(HttpServletRequest request){
        return getCookieValueByName(request, jwtRefreshCookie);
    }
    //endregion

    //region Clean cookies after logout
    public ResponseCookie getCleanJwtCookie(){
        return ResponseCookie.from(jwtCookie, null)
                .path("/api").build();
    }

    public ResponseCookie getCleanJwtRefreshCookie(){
        return ResponseCookie.from(jwtRefreshCookie, null)
                .path("/api/v1/auth/refresh-token").build();
    }
    //endregion

    //region Jwt Processing
    public String generateJwtToken(Authentication authentication) {
        // Implementation for generating JWT token
        UserDetailsImpl userPrincipal = (UserDetailsImpl) authentication.getPrincipal();

        return Jwts.builder()
                .subject((userPrincipal.getUsername()))
                .issuedAt(new Date())
                .expiration(new Date((new Date()).getTime() + jwtExpirationMs))
                .signWith(key())
                .compact();
    }

    public boolean validateJwtToken(String authToken) {
        try {
            Jwts.parser()
                    .verifyWith(key())
                    .build()
                    .parseSignedClaims(authToken);
            return true;
        } catch (MalformedJwtException e) {
            logger.error("Invalid JWT token: {}", e.getMessage());
        } catch (ExpiredJwtException e) {
            logger.error("JWT token is expired: {}", e.getMessage());
        } catch (UnsupportedJwtException e) {
            logger.error("JWT token is unsupported: {}", e.getMessage());
        } catch (IllegalArgumentException e) {
            logger.error("JWT claims string is empty: {}", e.getMessage());
        }

        return false;
    }

    public String getUserNameFromJwtToken(String token) {
        return Jwts.parser()
                .verifyWith(key())
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }

    public String generateTokenFromUserName(String username){
        return Jwts.builder()
                .subject(username)
                .issuedAt(new Date())
                .expiration(new Date((new Date()).getTime() + jwtExpirationMs))
                .signWith(key())
                .compact();
    }
    //endregion

    //region Private Helper
    private ResponseCookie generateCookie(String name, String value, String path){
        return ResponseCookie.from(name, value)
                .path(path)
                .maxAge(24 * 60 * 60)
                .httpOnly(true)
                .build();
    }

    private String getCookieValueByName(HttpServletRequest request, String name){
        Cookie cookie = WebUtils.getCookie(request, name);

        if(cookie != null){
            return cookie.getValue();
        } else {
            return null;
        }
    }
    //endregion

    public String parseJwt(HttpServletRequest request){
        String headerAuth = request.getHeader("Authorization");

        if(StringUtils.hasText(headerAuth) && headerAuth.startsWith("Bearer ")){
            return headerAuth.substring(7);
        }

        return null;
    }
}
