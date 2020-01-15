from fastapi import FastAPI
from starlette.staticfiles import StaticFiles
from starlette.middleware.cors import CORSMiddleware
from fastapi import FastAPI, Form
from starlette.requests import Request
from google.cloud import firestore
import datetime
import json

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


@app.get("/getWeek")
def get_week():
  weekNum = datetime.datetime.now().isocalendar()[1]
  db = firestore.Client()
  q = db.collection("lunch_users").where("week_{}".format(weekNum), '>', '').stream()
  for a in q:
    print( a.to_dict() )
  
  return {'hello': 'world'}

@app.get("/getTime/{login_id}")
def get_time(login_id : str):
  db = firestore.Client()
  weekNum = datetime.datetime.now().isocalendar()[1]
  q = db.collection("lunch_users").document(login_id).get().to_dict()
  q['currentWeek'] = weekNum
  print( q)
  return json.dumps( q)

@app.post("/updateTime")
async def update_time(*, request: Request):
    data =  await request.json() 
    weekNum = datetime.datetime.now().isocalendar()[1]
    print( data['times'] )
    db = firestore.Client()
    doc_ref = db.collection('lunch_users').document( data['login_id'] )
    doc_ref.set( {'login_id': data['login_id'] , "week_{}".format(weekNum) : data['times']}, merge=True)
    return {"Hello": "World"}
