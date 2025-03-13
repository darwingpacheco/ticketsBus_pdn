package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.io.File;
import java.io.IOException;

@SpringBootApplication
public class DemoApplication {

	public static void main(String[] args) { SpringApplication.run(DemoApplication.class, args );}

	private static void startAngular() {
		try {
			String backendPath = System.getProperty("user.dir");
			File frontendDir = new File(backendPath, "../front_end");
			String frontendPath = frontendDir.getAbsoluteFile().getCanonicalPath() + File.separator + "front_end_tickets_bus_pdn";

			ProcessBuilder processBuilder = new ProcessBuilder("cmd.exe", "/c", "start ng serve --open");
			processBuilder.directory(new File(frontendPath));

			processBuilder.start();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
}