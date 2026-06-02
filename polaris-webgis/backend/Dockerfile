##############################################################################
# POLARIS Backend — Docker Image
# 
# MENGAPA node:18-alpine?
# Alpine Linux menghasilkan image yang sangat kecil (~120MB vs ~900MB node:18)
# sambil tetap menyediakan runtime Node.js yang stabil dan aman.
##############################################################################
FROM node:18-alpine

# Metadata label untuk identifikasi image
LABEL maintainer="POLARIS WebGIS Team"
LABEL description="POLARIS API Backend — Express.js + PostGIS Client"

# Set working directory dalam container
WORKDIR /app

# Copy package files terlebih dahulu untuk memanfaatkan Docker layer caching.
# MENGAPA terpisah? Jika source code berubah tapi dependencies tidak,
# Docker bisa menggunakan cached layer untuk npm install (hemat waktu build).
COPY package.json package-lock.json* ./

# Install production dependencies saja (tanpa devDependencies)
# MENGAPA npm install (bukan npm ci)? npm ci membutuhkan package-lock.json
# yang sudah ada. Untuk build pertama, npm install akan membuat lock file.
RUN npm install --omit=dev && npm cache clean --force

# Copy seluruh source code backend ke container
COPY . .

# Expose port yang digunakan Express server
EXPOSE 5000

# Jalankan server sebagai non-root user untuk keamanan
# TODO(security): Alpine default node user sudah tersedia
USER node

# Command untuk menjalankan aplikasi
CMD ["node", "server.js"]
