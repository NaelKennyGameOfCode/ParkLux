import time
from firebase import firebase

def save_to_firebase(data):
    '''Saves data to our Firebase with the timestamp as a key.'''
    f = firebase.FirebaseApplication('https://parklux.firebaseio.com', None)
    unix_time = str(int(time.time()))
    f.put('/', unix_time, data)

# test_data = {
#     'Brasserie': {
#         'capacity': 270,
#         'available': 4,
#         'open': True,
#         'latitude': 49.61190,
#         'longitude': 6.14140
#     },
#     'Theatre': {
#         'capacity': 334,
#         'available': 4,
#         'open': True,
#         'latitude': 49.61308,
#         'longitude': 6.13016
#     },
#     'Test Closed': {
#         'capacity': 334,
#         'available': 4,
#         'open': False,
#         'latitude': 49.62308,
#         'longitude': 6.13016
#     },
#     'Test Full': {
#         'capacity': 150,
#         'available': 0,
#         'open': True,
#         'latitude': 49.60008,
#         'longitude': 6.11016
#     }
# }

# save_to_firebase(test_data)
