
printGreenLine () {
  ENDCOLOR='\033[0m'
  GREEN='\033[0;32m'
  echo -e "${GREEN}$1${ENDCOLOR}\n";
}

printRedLine () {
  RED='\033[0;31m'
  ENDCOLOR='\033[0m'
  echo -e "${RED}$1${ENDCOLOR}\n"
}
