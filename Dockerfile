FROM klakegg/hugo:ext-alpine

RUN apk add --no-cache git && \
    git config --global --add safe.directory /src

# Install LaTeX and latexmk- Don't think I need
RUN apk add --no-cache texlive-full

# Copy the compilation script to the container
COPY compile_tex.js /usr/local/bin/compile_tex.js

# Grant execution permissions to the script
RUN chmod +x /usr/local/bin/compile_tex.js

# Set the working directory
WORKDIR /src

# Compile .tex files using the Node.js module before building the Hugo site
RUN node /usr/local/bin/compile_tex.js

# Build the Hugo website
CMD hugo
