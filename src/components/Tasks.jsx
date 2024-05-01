import React, { useState } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { Card, Button } from 'react-bootstrap';
import CreateTaskModal from './Modal/CreateTaskModal';

const tasks = [
  {
    _id: 1,
    to: 'Matt',
    subject: "Nich's Chaps",
    priority: 'High',
    body: "Can you please look at Nich's chaps as Audit has shown there is an issue with them.  Can you let me know if they need replacing and what size?\nAlso Nich has a faulty lockout switch on his chainsaw.  Can you ask him to fix this asap",
    from: 'Office',
    date: 1678156206463,
    notes: [
      {
        from: 'Work Site',
        body: "Yes, I'm dealing with this.",
        date: 1678205621603
      }
    ]
  },
  {
    body: "mike, Hannah, jamie, Rachel, Justin, jade,Kim, danni, colt, Dan are going to work doo. Kim, Justin and partners are taking a wagon to race's. ",
    date: 1414485581847,
    from: 'Work Site',
    notes: [
      {
        date: 1414485581847,
        body: 'Is Colts partner not coming?',
        from: 'Office'
      },
      {
        date: 1414568825752,
        body: "no colt's partner not going ",
        from: 'Work Site'
      }
    ],
    priority: 'Low',
    subject: 'Message from Site',
    to: 'Office'
  },
  {
    to: 'Office',
    body: 'we need a stop on request sine  for road control\n',
    priority: 'Low',
    subject: 'Message from Site',
    from: 'Ground Base crew',
    notes: [
      {
        date: 1447285160684,
        body: 'Will talk to Bern about this',
        from: 'Office'
      },
      {
        date: 1447363409896,
        body: 'Have spoken to Bern and he informs me this is a JUken issue and they need to produce the signs as it is there road control.  So if they say something again politely inform them to phone me.',
        from: 'Office'
      },
      {
        date: 1447363409898,
        body: 'Have spoken to Nigga and he informs me this is a JUken issue and they need to produce the signs as it is there road control.  So if they say something again politely inform them to phone me.',
        from: 'Office'
      }
    ],
    date: 1447363409896
  }
];
const Tasks = () => {
  const [isCreateTaskModalVisible, setCreateTaskModalVisible] = useState(false);
  const renderTasks = () => {
    return tasks.map((task) => {
      if (!task.deleted) {
        const colour =
          task.priority === 'Low'
            ? 'success'
            : task.priority === 'Medium'
              ? 'warning'
              : task.priority === 'High'
                ? 'danger'
                : 'info';
  
        const messageAlign = task.from === 'Office' ? 'text-right' : 'text-left';
  
        return (
          <div key={task._id} style={{ margin: '8px' }}>
            <Card border={colour}>
              <Card.Header className={`bg-${colour} text-white`}>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <b>Attn: </b>
                    {task.to}
                  </div>
                  <div>
                    <b>Subject: </b>
                    {task.subject}
                  </div>
                  <div>
                    <Button
                      variant="primary"
                      size="sm"
                      className="editTaskButton"
                      data-toggle="modal"
                      data-target="#myEditModal"
                      id={task._id}
                    >
                      Edit
                    </Button>
                  </div>
                </div>
              </Card.Header>
              <Card.Body>
                <div className={`message-bubble-align ${task.from === 'Office' ? 'office' : ''}`}>
                  <div className={`message-bubble ${task.from === 'Office' ? 'office' : ''}`}>
                    <p>
                      <b style={{textAlign: 'left'}} >{task.from}</b>{' '}
                      <small style={{ color: '#999', fontSize: '0.7em', marginLeft: '8px' }}>
                        - {moment(task.date).format('DD MMM hh:mm a')}
                      </small>
                    </p>
                    <p>{task.body}</p>
                  </div>
                </div>
  
                {task.notes.map((note) => {
                  let msgBody = note.body;
                  if (note.body === "Yes, I'm dealing with this.") {
                    msgBody = (
                      <>
                        <span className="glyphicon glyphicon-ok"></span>&nbsp;&nbsp;{msgBody}
                      </>
                    );
                  }
                  const noteMessageAlign = note.from === 'Office' ? 'text-right' : 'text-left';
  
                  return (
                    <div key={note._id} className={`message-bubble-align ${note.from === 'Office' ? 'office' : ''}`}>
                      <div className={`message-bubble ${note.from === 'Office' ? 'office' : ''}`}>
                        <p>
                          <b>{note.from}</b>{' '}
                          <small style={{ color: '#999', fontSize: '0.7em', marginLeft: '8px' }}>
                            - {moment(note.date).format('DD MMM hh:mm a')}
                          </small>
                        </p>
                        <p>{msgBody}</p>
                      </div>
                    </div>
                  );
                })}
              </Card.Body>
            </Card>
          </div>
        );
      }
    });
  };
  

  renderTasks.propTypes = {
    tasks: PropTypes.array.isRequired
  };

  return (
    <div className="container">
      <CreateTaskModal show={true} />
      <h2>
        &nbsp;
        <img src="logo.jpg" className="img-thumbnail" />
        &nbsp;Tasks
        <div style={{ float: 'right' }}>
          <a href="#" className="btn btn-primary">
            <span className="glyphicon glyphicon-home"></span>&nbsp;&nbsp;Home
          </a>
        </div>
      </h2>
      <div style={{ textAlign: 'right' }}>
        <button
          className="btn btn-primary newTask-btn"
          onClick={() => document.getElementById('taskForm').reset()}
          data-toggle="modal"
          data-target="#myModal"
        >
          <span className="glyphicon glyphicon-th-list"></span>&nbsp;&nbsp;Create Task
        </button>
      </div>
      <br />
      {renderTasks()}
    </div>
  );
};

Tasks.propTypes = {
  tasks: PropTypes.array.isRequired
};

export default Tasks;
