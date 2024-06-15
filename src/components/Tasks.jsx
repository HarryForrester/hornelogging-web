import React, { useState, useEffect, useRef } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { Card, Button } from 'react-bootstrap';
import CreateTaskModal from './Modal/CreateTaskModal';
import EditTaskModal from './Modal/EditTaskModal';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { findNameById } from '../utils/FindNameById';

const Tasks = () => {
  const [isCreateTaskModalVisible, setCreateTaskModalVisible] = useState(false);
  const navigate = useNavigate();
  const [crews, setCrews] = useState([]);
  const [people, setPeople] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isEditTaskModalVisible, setEditTaskModalVisible] = useState(false);

   useEffect(() => {
    const handleWebSocketConnection = async () => {
      const ws = new WebSocket('ws://localhost:3001');

      ws.onopen = () => {
        console.log('WebSocket client connected');
      };

      ws.onmessage = async (event) => {
        // Handle incoming messages from the WebSocket server
        const parsedData = JSON.parse(event.data)
        console.log('Received message:', JSON.parse(event.data));
        // Handle the message data as needed
        setTasks(parsedData.tasks)
      };

      ws.onerror = (error) => {
        // Handle WebSocket errors
        console.error('WebSocket error:', error);
      };

      ws.onclose = () => {
        console.log('WebSocket client disconnected');
      };

      // Clean up the WebSocket connection when the component unmounts
      return () => {
        ws.close();
      };
    };

    handleWebSocketConnection();
  }, []);

  const handleEditButton = (task) => {
    setSelectedTask(task);
    setEditTaskModalVisible(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_URL}/tasks`, {
          withCredentials: true
        });

        if (response.data.isLoggedIn && response.status === 200) {
          console.log('data: ', response.data);
          setCrews(response.data.crews);
          setPeople(response.data.person);
          setTasks(response.data.tasks);
        } else {
          navigate('/login');
        }
      } catch (error) {
        console.log('Error occurred fetching data', error);
      }
    };

    fetchData();
  }, [navigate]);

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

        return (
          <div key={task._id} style={{ margin: '8px' }}>
            <Card border={colour} style={{ maxHeight: '400px', overflowY: 'auto' }}>
              <Card.Header className={`bg-${colour} text-white`}>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <b>Attn: </b>
                    {findNameById(task.to.toString(), people, crews)}
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
                      onClick={() => handleEditButton(task)}
                      id={task._id}
                    >
                      Edit
                    </Button>
                  </div>
                </div>
              </Card.Header>
              <Card.Body style={{ maxHeight: 'calc(400px - 38px)', overflowY: 'auto' }} ref={scrollToBottom}>
                <div className={`message-bubble-align ${task.from === 'Office' ? 'office' : ''}`}>
                  <div className={`message-bubble ${task.from === 'Office' ? 'office' : ''}`}>
                    <p>
                      <b style={{ textAlign: 'left' }}>{task.from === "Office" ? "Office" : findNameById(task.from, people, crews)}</b>{' '}
                      <small style={{ color: '#999', fontSize: '0.7em', marginLeft: '8px' }}>
                        - {moment(task.date).format('DD MMM hh:mm a')}
                      </small>
                    </p>
                    <p>{task.body}</p>
                  </div>
                </div>

                {task.notes &&
                  task.notes.map((note) => {
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
                      <div
                        key={note._id}
                        className={`message-bubble-align ${note.from === 'Office' ? 'office' : ''}`}
                      >
                        <div className={`message-bubble ${note.from === 'Office' ? 'office' : ''}`}>
                          <p>
                            <b>{note.from === "Office" ? "Office" : findNameById(note.from, people, crews)}</b>{' '}
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

  const scrollToBottom = (el) => {
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  };

  return (
    <div className="container">
      <CreateTaskModal
        show={isCreateTaskModalVisible}
        onHide={() => setCreateTaskModalVisible(false)}
        crews={crews}
        people={people}
      />
      <EditTaskModal
        show={isEditTaskModalVisible}
        onHide={() => setEditTaskModalVisible(false)}
        task={selectedTask}
        people={people}
        crews={crews}
        setTasks={setTasks}
      />
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
          onClick={() => setCreateTaskModalVisible(true)}
        >
          <span className="glyphicon glyphicon-th-list"></span>&nbsp;&nbsp;Create Task
        </button>
      </div>
      <br />
      {renderTasks()}
    </div>
  );
};

export default Tasks;
