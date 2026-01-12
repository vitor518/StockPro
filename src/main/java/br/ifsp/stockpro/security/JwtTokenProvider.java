package br.ifsp.stockpro.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtTokenProvider {

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiration}")
    private long jwtExpirationInMs;

    private Key getSigningKey() {
        // Certifique-se que sua secret tenha pelo menos 64 caracteres para HS512
        return Keys.hmacShaKeyFor(jwtSecret.getBytes());
    }

    public String generateToken(Authentication authentication) {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpirationInMs);

        return Jwts.builder()
                .setSubject(userDetails.getUsername())
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(getSigningKey(), SignatureAlgorithm.HS512)
                .compact();
    }

 public String getUsernameFromJWT(String token) {
    Claims claims = Jwts.parser() // Mudou de parserBuilder() para parser()
            .verifyWith((javax.crypto.SecretKey) getSigningKey()) // Mudou de setSigningKey() para verifyWith()
            .build()
            .parseSignedClaims(token) // Mudou de parseClaimsJws() para parseSignedClaims()
            .getPayload(); // Mudou de getBody() para getPayload()
    
    return claims.getSubject();
}

public boolean validateToken(String authToken) {
    try {
        Jwts.parser()
            .verifyWith((javax.crypto.SecretKey) getSigningKey())
            .build()
            .parseSignedClaims(authToken);
        return true;
    } catch (Exception ex) {
        System.err.println("Erro na validação do token: " + ex.getMessage());
    }
    return false;
}
}