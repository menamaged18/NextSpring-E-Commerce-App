package com.store.ecommerce.model;

import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "product")
@Setter
@Getter
public class Product {
    @Id
    @GeneratedValue( strategy = GenerationType.IDENTITY )
    private Long id;
    private String name;
    private Long quantity;
    private Double price;
    private Double cost_price;
    private String category;
    private String description;
    private String brand;
    private Double weight;
    private LocalDateTime created_at = LocalDateTime.now();
    private LocalDateTime updated_at;
    private Boolean is_active;

    public Product(){}
    public Product(String _name, String _category, String _description, long _quantity){
        this.name = _name;
        this.category = _category;
        this.description = _description;
        this.quantity = _quantity;
    }

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Reviews> reviews;

}


