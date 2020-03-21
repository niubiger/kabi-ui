rm -rf doc/.docz
rm -rf doc/src
mkdir doc/src
cp -r src/* doc/src
cd doc/

if [[ "$1" == "dev" || "$1" == "" ]]
then
    npm run dev
fi

if [[ "$1" == "prod" ]]
then
    npm run build
fi

if [[ "$1" == "serve" ]]
then
    npm run serve
fi