import { DataSource } from "typeorm";
import * as bcrypt from "bcrypt";
import * as dotenv from "dotenv";
import { AdminTypeormEntity } from "../entities/admin.typeorm-entity";

dotenv.config();

async function seedAdmin() {
  const dataSource = new DataSource({
    type: "postgres",
    host: process.env.DATABASE_HOST || "localhost",
    port: parseInt(process.env.DATABASE_PORT || "5432"),
    username: process.env.DATABASE_USER || "postgres",
    password: process.env.DATABASE_PASSWORD || "postgres",
    database: process.env.DATABASE_NAME || "blend",
    entities: [AdminTypeormEntity],
    synchronize: false,
  });

  try {
    await dataSource.initialize();
    console.log("Database connected");

    const adminRepository = dataSource.getRepository(AdminTypeormEntity);

    const email = process.env.ADMIN_EMAIL || "admin@example.com";
    const password = process.env.ADMIN_PASSWORD || "admin123";

    const existingAdmin = await adminRepository.findOne({ where: { email } });

    if (existingAdmin) {
      console.log(`Admin with email ${email} already exists. Skipping seed.`);
      await dataSource.destroy();
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const admin = adminRepository.create({
      email,
      passwordHash,
      role: "admin",
    });

    await adminRepository.save(admin);

    console.log("Admin user created successfully!");
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    console.log("Please change the password after first login.");

    await dataSource.destroy();
  } catch (error) {
    console.error("Error seeding admin:", error);
    process.exit(1);
  }
}

seedAdmin();
