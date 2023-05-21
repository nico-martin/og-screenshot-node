FROM node:18
RUN apt-get update && \
apt-get update && \ apt-get install -y libgtk2.0-0 libgtk-3-0 libnotify-dev \ libgconf-2-4 libnss3 libxss1 \ libasound2 libxtst6 xauth xvfb \ libgbm-dev
RUN mkdir -p /usr/src/slides-img/node_modules && chown -R node:node /usr/src/slides-img && mkdir -p /usr/src/slides-img/public
WORKDIR /usr/src/slides-img
COPY package*.json ./
RUN yarn install
COPY . .
EXPOSE 80
CMD [ "node", "yarn prod" ]
