import datetime
import requests
import model
import time
from bs4 import BeautifulSoup

def get_parking_data():
    response = requests.get("http://service.vdl.lu/rss/circulation_guidageparking.php")
    html = response.text

    soup = BeautifulSoup(html, "html.parser")
    lot_data = dict()

    for item in soup.find_all('item'):
        name = item.title.text
        capacity = int(item.find('vdlxml:total').text) if item.find('vdlxml:total').text != '' else 0
        taken = int(item.find('vdlxml:actuel').text) if item.find('vdlxml:actuel').text != '' else 0
        available = capacity - taken
        lot_open = True if item.find('vdlxml:ouvert').text == '1' else False

        lat = float(item.find('vdlxml:localisation').find('vdlxml:localisationlatitude').text)
        lng = float(item.find('vdlxml:localisation').find('vdlxml:localisationlongitude').text)

        lot_data[name] = {'capacity': capacity, 'available': available, 'open': lot_open, 'latitude': lat, 'longitude': lng}
        
    return lot_data
     
def get_data_and_save():
    data = get_parking_data()
    print('Data retrieved at ' + str(datetime.datetime.now()))
    model.save_to_firebase(data)

while True:
    get_data_and_save()
    time.sleep(60)
