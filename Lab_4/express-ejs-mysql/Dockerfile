# Build stage
FROM node:18-alpine

# Tạo thư mục làm việc
WORKDIR /app

# Copy package files
COPY package*.json ./

# Cài đặt dependencies
RUN npm install

# Copy toàn bộ source code
COPY . .

# Mở port 3000
EXPOSE 3000

# Command để chạy ứng dụng
CMD ["npm", "start"]
