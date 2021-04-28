# Soma miniproject chatbot

소프트웨어 마에스트로 미니프로젝트 챗봇 리포지토리

## Memboers
- `권준호` : 팀장
- `김영배`
- `박유천`
- `이도원` 
- `정용훈`
- `황희영`

## Develop Process

구름 컨테이너에서 여러 사람이 함께 작업하면 충돌이 발생할 확률이 매우 높습니다. 특히 Git을 사용해서 관리를 하게 될 텐데, 이때 다른 사람이 수정한, 원하지 않는 수정사항이 commit에 포함될 가능성이 높습니다. 따라서 수정을 할 때에는 로컬에 리포지토리를 클론하여 수정해야 합니다.

다만 이렇게 하게 되면 로컬에서 개발한 후 매번 컨테이너에 접속하여 `pull`해줘야 한다는 번거로움이 있습니다. 그래서 GitHub Webhook을 사용했습니다. 만약 `push`이벤트가 발생할 시 GitHub에서 우리 컨테이너에서 돌아가고 있는 서버에 POST request를 전송하고, 그러면 서버는 `git pull`을 수행합니다. 이를 위해 서버를 `supervisor`를 사용해서 구동, 만약 서버 관련 파일이 변경될 경우 서버를 재시작하도록 구성했습니다.

로컬에서 수정한 후 `push`하시면 수 초 내로 서버에서 `pull`이 이루어지고 서버가 재시작됩니다.

좀 더 자유로운 프로세스 관리를 위해 `tmux`를 이용합니다.
- `tmux ls` 명령어를 통해 생성된 `tmux` 세션들을 볼 수 있습니다.
- `tmux attach -t [세션 번호]` 명령어를 통해 세션에 접속할 수 있습니다.
- `ctrl+b, d` 단축키를 통해 접속한 세션에서(세션을 종료하지 않고) 빠져나올 수 있습니다.
    - 이렇게 할 경우 세션은 백그라운드에서 동작합니다.
- 세션을 종료하고 싶을 경우 일반적인 쉘과 마찬가지로 `exit`명령어로 세션을 종료하면 됩니다.