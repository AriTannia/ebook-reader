package com.aritan.ebook_reader.common.models.user;

import com.aritan.ebook_reader.common.constants.tables.user.RoleTableConstants;
import com.aritan.ebook_reader.common.enums.ERole;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = RoleTableConstants.TABLE_NAME, schema = RoleTableConstants.SCHEMA)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Role {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = RoleTableConstants.ROLE_ID, updatable = false, nullable = false)
    private Integer id;

    @Enumerated(EnumType.STRING)
    @Column(name = RoleTableConstants.NAME, nullable = false, unique = true, length = 20)
    private ERole name;

    public Role(ERole name){
        this.name = name;
    }
}
