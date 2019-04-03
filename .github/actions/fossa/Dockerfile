FROM node:10

LABEL version="0.0.1"
LABEL repository="https://github.com/Librazy/react-with-websocket"
LABEL homepage="https://github.com/Librazy/react-with-websocket"
LABEL maintainer="Liqueur Librazy <im@librazy.org>"

LABEL "com.github.actions.name"="GitHub Action for FOSSA"
LABEL "com.github.actions.description"="FOSSA"
LABEL "com.github.actions.icon"="play"
LABEL "com.github.actions.color"="purple"

RUN curl -H 'Cache-Control: no-cache' https://raw.githubusercontent.com/fossas/fossa-cli/master/install.sh | bash

COPY entrypoint.sh /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]

CMD ["./.github/actions/fossa/run.sh"]
