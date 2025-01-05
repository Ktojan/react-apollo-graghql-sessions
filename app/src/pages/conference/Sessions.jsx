import React, {useState} from "react";  
import { Link } from "react-router-dom"
import { Formik, Field, Form, formik } from "formik"
import { gql, useQuery, useMutation } from "@apollo/client"

const levels = ["Introductory and overview", "Medium", "Advanced"];

export const SESSIONS_FIELDS = gql`
  fragment SessionFields on Session {
      id
      title
 			level 
    	day
      startsAt
    	description
      room     
      speakers {
        id
        name
      }
  }`;
const SESSIONS = gql`
  query sessions($day: String, $level: String) {
    sessions(day: $day, level: $level) {
     ...SessionFields
    }
  }
  ${SESSIONS_FIELDS}
`

const CREATE_SESSION = gql`
  mutation createSessionMut($session: SessionInput!) {
    createSession(session: $session) {
      ...SessionFields
    }
  }
  ${SESSIONS_FIELDS}
`

const daysArray = ['Wednesday', 'Thursday', 'Friday'];

const newSessions = [
{        
  "title": "Advanced Semaphore Ballet",
  "level": "Advanced",
  "day": "Friday",
  "description": "Master the art of semaphore synchronization in an elegant ballet of complex code.",
},{
  "title": "Medium Middleware Minotaur",
  "level": "Medium",
  "day": "Wednesday",
  "description": "Navigate the labyrinth of middleware with medium-difficulty and avoid the dreaded minotaur of bugs.",
}
]

const emptySession = {  	
  title: "",	
  description: "",	
  day: "",	
  level: "",	
}

function SessionList( { day, level }) {
  const variables = { };
  if (day !== "All") variables.day = day ? day : daysArray[0];
  if (level) variables.level = level;

  // GraphQL Sessions request
  const { data, loading, error } = useQuery(SESSIONS, { variables });

  if (error) {
    console.error(error);
    return <blockquote>{error.message}</blockquote>;
  }
  if (loading) return <p>Loading Sessions...</p>;

  if (!data ||  data.sessions.length === 0) return null;
  // const allSessions = data.intro.concat(data.inter, data.adv);
  return data.sessions.map(session => (
    <SessionItem key={session.id} session={ {...session } }
    />
  ));
}

function SessionItem({ session }) {
  const { id, title, level, day, startsAt, description, room, speakers } = session;
  let range = 5;
  switch (level) {
    case 'Introductory and overview': 
    range = 1; break;
    case 'Medium': 
    range = 5; break;
    case 'Advanced': 
    range = 8; 
  }
  return (
    <div key={id} className="col-xs-12 col-sm-6" style={{ padding: 5 }}>
      <div className="panel panel-default">
        <div className="panel-heading">
          <h5>{`Level: `}
            <label>{level}</label> 
            <input style={{ width: '20%', display: 'inline-block', marginLeft: '5%'}} 
            type="range" defaultValue={range} min="0" max="9" />
          </h5>
          <details>
          <summary>{title}</summary>
          <p>{description}</p>
          </details>
        </div>
        <div className="panel-body">
          <h5>{`Day: `} {day}</h5>
          <h5>{`Room Number: ${room}`} </h5>
          <h5>{`Starts at: ${startsAt}`}</h5>
        </div>
        <div className="panel-footer">
          { speakers.map(sp => (
            <span key={sp.id} style={{padding: 2}}>
              <Link className="btn btn-lg btn-danger" to={`speaker/${sp.id}`}> View {sp.name}'s Profile
              </Link>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Sessions() {
  const [selectedDay, setSelectedDay] = useState(daysArray[0]);
  const [levelFilter, setLevelFilter] = useState("");

  return (
    <>
      <section className="banner">
        <div className="container">
          <div className="col-md-8">
          <div className="row" style={{ padding: '2rem',  marginBottom: '2rem', borderBottom: '2px solid gray' }}>	
            <Link	className="btn btn-lg center-block new-session"	to={`/conference/sessions/new`}	
            >	Create new session
            </Link>	
          </div>
          <div className="col-sm-8">
            <button type="button" onClick={() => setSelectedDay('All')} className={`btn-oval ${ selectedDay === 'All' ? "selected" : ""}` }>
              All Days
            </button >
            {
              daysArray.map(day => (
                <button key={day} type="button" onClick={() => setSelectedDay(day)}
                 className={`btn-oval ${ day === selectedDay ? "selected" : ""}` }>
              {day} </button>
              ))
            }   
          </div>         

           <div className="col-sm-4" style={{display: 'flex', justifyContent: 'space-between'}}>
            <label>Filter by level </label>
            <select name="level" value={levelFilter} onChange={(e)=> setLevelFilter(e.target.value)}>
              <option value="">-- All levels --</option>
                {levels.map((level, i) => 
                    <option value={level} key={i}>{level}</option>
                )}
            </select>            
          </div>

          { <SessionList day={selectedDay} level={levelFilter} />}
          {/* { day === 'All' && <SessionList /> } */}
          {/* { day === 'All' && <AllSessionList /> } */}
          </div>
          <div className="col-md-4 code-area">
            <h2>Key code and GraphQL</h2>
            <pre>
              <code>
      {CODE_CHUNK_1}
            </code>
            </pre>
          </div>
        </div>
      </section>
    </>
  );
}

export function SessionForm() {	

  function updateSessions(cache, { data}) {
    cache.modify({
      fields: {
        sessions(existingSessions = []) {
          const newSession = data.createSession;
          cache.writeQuery({
            query: SESSIONS,
            data: { newSession, ...existingSessions }
          })
        }
      }
    })
  }

  const [ createFunction, { data, error, called } ] = useMutation(CREATE_SESSION, {
    update: updateSessions
  });

  if (data) console.log(data);
  if (error) {
    console.error(error);
    return <blockquote> <p>Failed to create new session</p>
      {error.message} </blockquote>;
  }
  if (called && data) return (<blockquote className="succ"> <p>Session created!</p>
      ID = {data.createSession.id} </blockquote>)

  return (	
    <div	
      style={{	
        width: "100%",	
        display: "flex",	
        alignContent: "center",	
        justifyContent: "center",	
        padding: 10,	
      }}	
    >	
      <Formik
        initialValues={newSessions[0] || emptySession}
        onSubmit={async (values, actions) => { 
          const resp = await createFunction({ variables: { session: values }});
          newSessions.shift();      
        }}	
      >	
        {() => (	
          <Form style={{ width: "100%", maxWidth: 500 }}>	
            <h3 className="h3 mb-3 font-weight-normal">Submit a Session!</h3>	

            <div className="mb-3" style={{ paddingBottom: 5 }}>	
              <label htmlFor="inputTitle">Title</label>	
              <Field	
                id="inputTitle"	
                className="form-control"	
                required	
                autoFocus	
                name="title"	
              />	
            </div>	
            <div className="mb-3" style={{ paddingBottom: 5 }}>	
              <label htmlFor="inputDescription">Description</label>	
              <Field	
                type="textarea"	
                id="inputDescription"	
                className="form-control"	
                required	
                name="description"	
              />	
            </div>	
            <div className="mb-3" style={{ paddingBottom: 5 }}>	
              <label htmlFor="inputDay">Day</label>	
              <Field	
                name="day"	
                id="inputDay"	
                className="form-control"	
              />	
            </div>	
            <div className="mb-3" style={{ paddingBottom: 5 }}>	
              <label htmlFor="inputLevel">Level</label>	
              <Field	
                name="level"	
                id="inputLevel"	
                className="form-control"	
              />	
            </div>	
            <div style={{ justifyContent: "center", alignContent: "center" }}>
              <button className="btn btn-primary" type="submit">Submit</button>	
            </div>
          </Form>	
        )}	
      </Formik>	
    </div>	
  );	
}

export function AddSession() {	
  return (	
    <>	
      <section className="banner">	
        <div className="container">	
          <div className="row">	
            <SessionForm />	
          </div>	
        </div>	
      </section>	
    </>	
  );	
}

const CODE_CHUNK_1 = `
GET SESSIONS IN GRAPHQL:

const SESSIONS_FIELDS = gql"
  fragment SessionFields on Session {
      id
      title
 		  level 
    	day
      startsAt
    	description
      room     
      speakers {
        id
        name
      }
  };
const SESSIONS = gql
  query sessions($day: String, $level: String) {
    sessions(day: $day, level: $level) {
     ...SessionFields
    }
  }
  $[SESSIONS_FIELDS}
"
----------
USAGE OF REQUESTED DATA

function SessionList( { day, level }) {
  const variables = { };
  if (day !== "All") variables.day = day ? day : daysArray[0];
  if (level) variables.level = level;

  const { data, loading, error } = useQuery(SESSIONS, { variables });

  if (error) {
    console.error(error);
    return <blockquote>{error.message}</blockquote>;
  }
  if (loading) return <p>Loading Sessions...</p>;

  if (!data ||  data.sessions.length === 0) return null;
  return data.sessions.map(session => (
    <SessionItem key={session.id} session={ {...session } }
    />
  ));
}
-------------------------------------------
CREATE NEW SESSION 

const CREATE_SESSION = gql
  mutation createSessionMut($session: SessionInput!) {
    createSession(session: $session) {
      ...SessionFields
    }
  }
  $[SESSIONS_FIELDS}

-----------

 const [ createFunction, { data, error, called } ] = useMutation(CREATE_SESSION, {
    update: updateSessions
  });

  if (data) console.log(data);
  if (error) {
    console.error(error);
    return <blockquote> <p>Failed to create new session</p>
      {error.message} </blockquote>;
  }
  if (called && data) return (<blockquote className="succ"> <p>Session created!</p>
      ID = {data.createSession.id} </blockquote>)

  return (	
    <div>	
      <Formik
        initialValues={newSessions[0] || emptySession}
        onSubmit={async (values, actions) => { 
          const resp = await createFunction({ variables: { session: values }});
`
