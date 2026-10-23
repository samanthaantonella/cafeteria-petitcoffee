package com.br.cafeteria.petitcoffe.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {

    // Página inicial
    @GetMapping("/")
    public String index() {
        return "index";
    }

    // Página de produtos
    @GetMapping("/produtos")
    public String produtos() {
        return "produtos";
    }

    // Página de pedidos
    @GetMapping("/pedidos")
    public String pedidos() {
        return "pedidos";
    }

    // Página de login
    @GetMapping("/login")
    public String login() {
        return "login";
    }
}
