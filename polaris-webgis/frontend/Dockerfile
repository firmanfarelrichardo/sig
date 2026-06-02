##############################################################################
# POLARIS Frontend — Multi-stage Docker Build
# 
# MENGAPA multi-stage?
# Stage 1 (build): Menggunakan Node.js untuk compile React + TailwindCSS
# Stage 2 (serve): Menggunakan Nginx Alpine (~25MB) untuk serve static files
# Hasil: Image final sangat kecil karena TIDAK mengandung node_modules.
##############################################################################

# ============================================================================
# STAGE 1: Build React Application
# ============================================================================
FROM node:18-alpine AS build

WORKDIR /app

# Terima build argument untuk API URL
ARG REACT_APP_API_URL=http://localhost:5000
ENV REACT_APP_API_URL=${REACT_APP_API_URL}

# Copy package files untuk Docker layer caching
COPY package.json package-lock.json* ./

# Install semua dependencies (termasuk devDependencies untuk build)
# MENGAPA npm install? npm ci membutuhkan package-lock.json yang sudah ada.
RUN npm install && npm cache clean --force

# Copy seluruh source code
COPY . .

# Build production bundle
RUN npm run build

# ============================================================================
# STAGE 2: Serve dengan Nginx
# ============================================================================
FROM nginx:1.25-alpine AS production

# Copy custom Nginx config untuk SPA routing
# MENGAPA custom config? React Router membutuhkan semua request diarahkan 
# ke index.html (fallback), bukan 404 error dari Nginx.
COPY --from=build /app/build /usr/share/nginx/html

# Buat Nginx config untuk SPA + security headers
RUN printf 'server {\n\
    listen 80;\n\
    server_name localhost;\n\
    root /usr/share/nginx/html;\n\
    index index.html;\n\
\n\
    # Security Headers\n\
    add_header X-Content-Type-Options "nosniff" always;\n\
    add_header X-Frame-Options "DENY" always;\n\
    add_header X-XSS-Protection "1; mode=block" always;\n\
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;\n\
    add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;\n\
\n\
    # Gzip compression untuk performa\n\
    gzip on;\n\
    gzip_types text/css application/javascript application/json image/svg+xml;\n\
    gzip_min_length 256;\n\
\n\
    # SPA fallback — semua route diarahkan ke index.html\n\
    location / {\n\
        try_files $uri $uri/ /index.html;\n\
    }\n\
\n\
    # Cache static assets (JS, CSS, images)\n\
    location ~* \\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {\n\
        expires 1y;\n\
        add_header Cache-Control "public, immutable";\n\
    }\n\
\n\
    # Deny access to hidden files\n\
    location ~ /\\. {\n\
        deny all;\n\
    }\n\
}\n' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
