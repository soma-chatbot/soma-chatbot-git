echo Start data crawling...

python3 air.py 09140550 > air.json
echo [1/4] Fine dust data has been crawled.

python3 weather.py 09140550 > weather.json
echo [2/4] Weather data has been crawled.

python3 news.py > news.json
echo [3/4] News data has been crawled.

python3 covid.py > covid.json
echo [4/4] Covid data has been crawled.

# Uncomment here to see decoded json files

# cat air.json | jq '.'
# cat weather.json | jq '.'
# cat news.json | jq '.'
# cat covid.json | jq '.'