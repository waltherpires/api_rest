npm run build
git add .
read message
echo "Mensagem do commit: "
git commit -am "$message"
git push
ssh 34.95.224.221 \
 'git -C /home/Walther/api/ ' \
 'pull origin master && ' \
 'pm2 restart api && sudo systemctl restart nginx'
