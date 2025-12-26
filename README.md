docker-compose up -d

# 1. Убедитесь, что в .env правильный DATABASE_URL
cat .env

# 2. Сгенерируйте Prisma Client заново
npx prisma generate

# 3. Проверьте, что таблицы существуют в базе
npx prisma db pull

# 4. Если таблиц нет - создайте их
npx prisma db push

# ИЛИ создайте миграцию
npx prisma migrate dev --name init

# 5. Перезапустите сервер
npm run start:dev