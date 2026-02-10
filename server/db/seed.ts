import { scrypt, randomBytes } from 'node:crypto';
import { promisify } from 'node:util';
import { db } from '.';
import { usersTable } from './schema';

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString('hex');
  const derivedKey = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${salt}:${derivedKey.toString('hex')}`;
}

async function main() {
  console.log('🌱 Seeding database...');

  const hashedPassword = await hashPassword('12345678');

  await db.insert(usersTable).values([
    {
      name: 'Pedri',
      email: 'pedri@gmail.com',
      password: hashedPassword,
      token: null,
      confirmed: true,
    },
    {
      name: 'Fran',
      email: 'fran@gmail.com',
      password: hashedPassword,
      token: null,
      confirmed: true,
    },
    {
      name: 'Gavi',
      email: 'gavi@gmail.com',
      password: hashedPassword,
      token: null,
      confirmed: true,
    },
  ]);

  console.log('✅ Database seeded successfully!');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Error seeding database:', error);
    process.exit(1);
  });
