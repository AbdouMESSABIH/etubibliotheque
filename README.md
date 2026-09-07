<div align="center">

# 📚 EtuBibliothèque

### Projet 2 — Expert DevOps OpenClassrooms

**Amélioration d'une application full-stack existante, sécurisation JWT et mise en place d'une stratégie complète de tests.**

<br>

[![Java](https://img.shields.io/badge/Java-21-orange?style=for-the-badge&logo=openjdk)](https://openjdk.org/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5-brightgreen?style=for-the-badge&logo=springboot)](https://spring.io/projects/spring-boot)
[![Angular](https://img.shields.io/badge/Angular-19-red?style=for-the-badge&logo=angular)](https://angular.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Docker](https://img.shields.io/badge/Docker-Testcontainers-blue?style=for-the-badge&logo=docker)](https://www.docker.com/)

<br>

![Backend Coverage](https://img.shields.io/badge/Back--end%20coverage-81%25-success?style=flat-square)
![Frontend Coverage](https://img.shields.io/badge/Front--end%20statements-83.33%25-success?style=flat-square)
![Frontend Lines](https://img.shields.io/badge/Front--end%20lines-81.57%25-success?style=flat-square)
![E2E](https://img.shields.io/badge/Cypress-8%2F8%20passing-success?style=flat-square)

</div>

---

## 🎯 Objectif du projet

Le projet consiste à reprendre une application existante **Spring Boot + Angular**, à analyser son architecture, corriger son authentification puis ajouter la gestion complète des étudiants.

Une stratégie de tests a ensuite été mise en place sur les trois niveaux :

- tests unitaires ;
- tests d'intégration ;
- tests End-to-End.

L'objectif est d'obtenir une application fonctionnelle, sécurisée et vérifiée automatiquement.

---

## 🏗️ Architecture

```mermaid
flowchart LR
    A[Angular Front-end] -->|HTTP / JSON| B[Spring Boot API]
    B --> C[Controller]
    C --> D[Service]
    D --> E[Repository]
    E --> F[(MySQL)]

    A --> G[Auth Guard]
    A --> H[JWT Interceptor]

    B --> I[JWT Security]
    I --> C
