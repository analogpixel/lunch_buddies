from fastapi import FastAPI
from starlette.staticfiles import StaticFiles
from starlette.middleware.cors import CORSMiddleware
from fastapi import FastAPI, Form
from starlette.requests import Request
from google.cloud import firestore
import datetime
import json
from starlette.responses import HTMLResponse

app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")

# CORS BS
app.add_middleware(
    CORSMiddleware,
  allow_origins=["http://localhost", "http://localhost:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# get lunch dates for this week
@app.get("/getLunchDates")
def get_lunch_dates():
  weekNum = datetime.datetime.now().isocalendar()[1]
  db = firestore.Client()
  doc_ref = db.collection("lunch_dates").where("week", "==", weekNum)

  l = []
  for a in doc_ref.stream():
    l.append( a.to_dict() )

  return json.dumps(l)

@app.post("/createLunchDate")
async def create_lunch_date(*, request: Request):
  data = await request.json()
  weekNum = datetime.datetime.now().isocalendar()[1]
  data['week'] = weekNum
  print("JSON data for request:", data)
  db = firestore.Client()
  doc_ref = db.collection('lunch_dates').document( "{}_{}_{}".format(data['day'], data['time'], weekNum) )
  doc_ref.set( data )
  return "{}"

@app.get("/getWeek")
def get_week():
  weekNum = datetime.datetime.now().isocalendar()[1]
  db = firestore.Client()
  q = db.collection("lunch_users").where("week_{}".format(weekNum), '>', '').stream()
  people = []
  for a in q:
    t = a.to_dict() 
    people.append( [t['login_id'], t["week_{}".format(weekNum)]] )
  
  return json.dumps(people)

@app.get("/getTime/{login_id}")
def get_time(login_id : str):
  db = firestore.Client()
  weekNum = datetime.datetime.now().isocalendar()[1]
  q = db.collection("lunch_users").document(login_id).get().to_dict()
  if q:
    q['currentWeek'] = weekNum
    print( q)
    return json.dumps( q)
  else:
    # no data this week? send some default data back
    return json.dumps({"week_{}".format(weekNum) : "0,0,0:0,0,0:0,0,0:0,0,0:0,0,0", "login_id": login_id, "currentWeek": weekNum}) 

@app.post("/updateTime")
async def update_time(*, request: Request):
    data =  await request.json() 
    weekNum = datetime.datetime.now().isocalendar()[1]
    print( data['times'] )
    db = firestore.Client()
    doc_ref = db.collection('lunch_users').document( data['login_id'] )
    doc_ref.set( {'login_id': data['login_id'] , "week_{}".format(weekNum) : data['times']}, merge=True)
    return {"Hello": "World"}

@app.get("/.*", include_in_schema=False)
def root():
    return HTMLResponse(open('static/index.html').read())

