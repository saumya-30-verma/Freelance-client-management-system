import React, { useState, useEffect } from "react";
import './App.css'

function App() {

  const [name, setName] = useState("");
  const [projectValue, setprojectValue] = useState("");
  const [editName, seteditName] = useState("");
  const [editprojectValue, seteditprojectValue]= useState("");
  const [paymentAmount, setpaymentAmount] = useState("");
  const [editingClientId, seteditingClientId] = useState(null);
  const [clients, setClients] = useState(() => {
    const saved= localStorage.getItem("clients");
    return saved ? JSON.parse(saved): []
  });

  function addClient (){

    if(name.trim() === "" || projectValue.trim() === "") return;

    const newClient = {
      id: Date.now(). toString(),
      name: name,
      totalEarnings: 0,
      projectValue: Number (projectValue)
    };

    setClients ([...clients, newClient]);
    setName("");
    setprojectValue("");
  }

  const totalEarnings = clients.reduce ((acc,client) => {
    return acc + client.totalEarnings;
  }, 0);

  const totalPending = clients.reduce((acc,client) => {
    return acc+(client.projectValue - client.totalEarnings)
  }, 0);

  function deleteClient(id) {
    const updatedClients = clients.filter(client=> client.id !== id)
    setClients(updatedClients);
  }

  const totalClients = clients.length;

  function addEarning(id) {
    if (paymentAmount.trim() === "") return;
    const amount = Number (paymentAmount);
    const updatedClients= clients.map((client) => {
      if (client.id === id) {
         const newTotal= client.totalEarnings + amount;
         if(newTotal > client.projectValue) {
          return client;
         }

        return {
          ...client, totalEarnings: newTotal
        };

      } else {
        return client;
      }
    });
     setClients(updatedClients);
     setpaymentAmount("");
  }

  function saveEdit(id) {
   const updatedClients = clients.map((client) => {
    if (client.id === id) {
      return {
        ...client,
        name: editName,
        projectValue: Number(editprojectValue)
      };
    }
    return client;
   });
   setClients(updatedClients);
   seteditingClientId(null);
  }

  useEffect(() => {
    localStorage.setItem ("clients", JSON.stringify(clients))
  }, [clients]);

  return (
    <>
    <div className="client-section">

      <div className="input-row">
         <input 
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Client Name"
        />

        <input 
        type="number"
        value={projectValue}
        onChange={(e) => setprojectValue(e.target.value)}
        placeholder="Project Value"
        />
           
        <input 
        type="number"
        value={paymentAmount}
        onChange={(e) => setpaymentAmount(e.target.value)}
        placeholder="Payment Value"
        />
        

     <button className ="add-btn" onClick={addClient}>
      Add Client
     </button>
      </div>

      <ul>
      {clients.map((client) => (
        <li key={client.id}>
          {editingClientId === client.id ? (
          <>
          <input 
          type="text" 
          value={editName} 
          onChange={(e)=> seteditName(e.target.value)}
          />

          <input 
          type="number" 
          value={editprojectValue}
          onChange={(e)=> seteditprojectValue(e.target.value)}
          />
          <button onClick={()=> saveEdit(client.id)}>Save</button>
          <button onClick={()=> seteditingClientId(null)}>Cancel</button>
          </>
          ):(
            <>
              {client.name} - ₹{client.totalEarnings}
            </>
          )}
          
          <p>Pending: {client.projectValue - client.totalEarnings}</p>

        <button className ="del-btn" onClick={() => deleteClient(client.id)}>Delete</button>
        <button onClick={() => {
         seteditingClientId(client.id);
         seteditName(client.name);
         seteditprojectValue(client.projectValue);

        }}>
          Edit
          </button>
        <button onClick={() => addEarning(client.id)}
          disabled= {client.totalEarnings >= client.projectValue}
          >Add Payment</button>
        </li>
      ))}
     </ul>
     </div>
      
      <div className="app-container">

        <header className="header">
          <h1>Freelance Client Management System</h1>
        </header>

        <section className="dashboard">
          <div className="card">Total clients: {totalClients}</div>
          <div className="card">Total earnings: {totalEarnings}</div>
          <div className="card">Pending amount: {totalPending}</div>
        </section>

        <section className="main-section">
            <div className="forms-section">
               <h2>Forms Section</h2>
            </div>

            <div className="data-section">
               <h2>Data Section</h2>
            </div>
        </section>

      </div>
      
    </>
  )
}

export default App



