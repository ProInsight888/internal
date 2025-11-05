<p align="center">
  <a href="https://laravel.com" target="_blank">
    <img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400" alt="Laravel Logo">
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/JSON-000000.svg?style=flat&logo=JSON&logoColor=white" alt="JSON">
  <img src="https://img.shields.io/badge/Markdown-000000.svg?style=flat&logo=Markdown&logoColor=white" alt="Markdown">
  <img src="https://img.shields.io/badge/npm-CB3837.svg?style=flat&logo=npm&logoColor=white" alt="NPM">
  <img src="https://img.shields.io/badge/Autoprefixer-DD3735.svg?style=flat&logo=Autoprefixer&logoColor=white" alt="Autoprefixer">
  <img src="https://img.shields.io/badge/PostCSS-DD3A0A.svg?style=flat&logo=PostCSS&logoColor=white" alt="PostCSS">
  <img src="https://img.shields.io/badge/Composer-885630.svg?style=flat&logo=Composer&logoColor=white" alt="Composer">
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E.svg?style=flat&logo=JavaScript&logoColor=black" alt="JavaScript">
  <img src="https://img.shields.io/badge/React-61DAFB.svg?style=flat&logo=React&logoColor=black" alt="React">
  <img src="https://img.shields.io/badge/XML-005FAD.svg?style=flat&logo=XML&logoColor=white" alt="XML">
  <img src="https://img.shields.io/badge/PHP-777BB4.svg?style=flat&logo=PHP&logoColor=white" alt="PHP">
  <img src="https://img.shields.io/badge/Vite-646CFF.svg?style=flat&logo=Vite&logoColor=white" alt="Vite">
  <img src="https://img.shields.io/badge/Axios-5A29E4.svg?style=flat&logo=Axios&logoColor=white" alt="Axios">
</p>

---

## Table of Contents

- Overview
- Getting Started
    - Prerequisites
    - Installation
    - Usage

## 📘 Overview

**Internal** is a comprehensive developer toolkit designed to streamline the development of scalable Laravel applications with a rich frontend and backend architecture.

### Core Features

* Organized components, controllers, and models for maintainability.
* Reusable, accessible components built with **Radix UI** and **Tailwind CSS**.
* Integrated **React** + **Inertia.js** frontend for dynamic user experiences.
* Role-based authentication and policy control.
* Preconfigured **PHPUnit** testing and **Seeder** data.
* Built-in modules for Calendar, Tasks, Media, and Data management.

---

## ⚙️ Getting Started

### Prerequisites

This project requires the following dependencies:

* **PHP**
* **Composer** (PHP package manager)
* **Node.js** & **NPM** (JavaScript package manager)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/ProInsight888/internal
cd internal
```

2. **Install dependencies**

```bash
composer install
npm install
```

3. **Environment setup**

```bash
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
```

### Running the project

```bash
npm run dev
php artisan serve
```

---

## 🤝 Contributions

For internal company use only.
Please contact the development lead or read the internal documentation before operating or modifying the system.

https://docs.google.com/document/d/1dQALWWxEW7GibQDJXBhzI60QHxfdpEixhuvUbLN7ZhE/edit?usp=sharing

---

## 🔒 License

This project is **not open-sourced** and is restricted to company employees only.

