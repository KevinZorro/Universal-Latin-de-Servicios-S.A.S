plugins {
    java
    id("org.springframework.boot") version "3.5.8"
    id("io.spring.dependency-management") version "1.1.7"
    id("org.asciidoctor.jvm.convert") version "3.3.2"
}

group = "com.ufps"
version = "0.0.1-SNAPSHOT"
description = "Demo project for Spring Boot"

java {
    toolchain {
        languageVersion = JavaLanguageVersion.of(21)
    }
}

configurations {
    compileOnly {
        extendsFrom(configurations.annotationProcessor.get())
    }
}

repositories {
    mavenCentral()
}

extra["snippetsDir"] = file("build/generated-snippets")
extra["springCloudVersion"] = "2025.0.0"

dependencies {

    // ----- UTILIDADES -----
    implementation("org.apache.poi:poi-ooxml:5.2.5")
    implementation("org.apache.pdfbox:pdfbox:2.0.30")
    implementation("com.squareup.okhttp3:okhttp:4.12.0")

    // ----- SPRING -----
    implementation("org.springframework.boot:spring-boot-starter-data-jpa") // JPA OK
    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("org.springframework.boot:spring-boot-starter-validation")
    implementation("org.springframework.boot:spring-boot-starter-security")
    implementation("org.springframework.boot:spring-boot-starter-hateoas")

    // ----- JWT -----
    implementation("io.jsonwebtoken:jjwt-api:0.11.5")
    runtimeOnly("io.jsonwebtoken:jjwt-impl:0.11.5")
    runtimeOnly("io.jsonwebtoken:jjwt-jackson:0.11.5")

    // ----- LOMBOK + SUPERBUILDER -----
    compileOnly("org.projectlombok:lombok")
    annotationProcessor("org.projectlombok:lombok")

    // lombok.experimental.SuperBuilder
    annotationProcessor("org.projectlombok:lombok-mapstruct-binding:0.2.0")

    // ----- POSTGRES -----
    runtimeOnly("org.postgresql:postgresql")

    // ----- DEV -----
    developmentOnly("org.springframework.boot:spring-boot-devtools")

    // ----- TEST -----
    testImplementation("org.springframework.boot:spring-boot-starter-test")
}

dependencyManagement {
    imports {
        mavenBom("org.springframework.cloud:spring-cloud-dependencies:${property("springCloudVersion")}")
    }
}

tasks.withType<Test> {
    useJUnitPlatform()
}

tasks.test {
    outputs.dir(project.extra["snippetsDir"]!!)
}

tasks.asciidoctor {
    inputs.dir(project.extra["snippetsDir"]!!)
    dependsOn(tasks.test)
}
