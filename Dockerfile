FROM node:18-alpine
#ARG SHOPIFY_API_KEY
ENV SHOPIFY_API_KEY=6b4c7f563a14b50c24714b5687ede505
EXPOSE 8081
WORKDIR /app
COPY web .
RUN npm install
RUN cd frontend && npm install && npm run build
CMD ["npm", "run", "serve"]
