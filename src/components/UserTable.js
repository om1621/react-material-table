import React, { useState, useEffect } from "react";
import MaterialTable from "material-table";
import { userTableColumns } from "../data/userTableColumns";
import axios from "axios";

const UserTable = () => {
  const [userTableData, setUserTableData] = useState([]);
  const [loading, setLoading] = useState(true);

  const addUser = async (newData) => {
    const { data } = await axios.post(
      `https://jsonplaceholder.typicode.com/users`,
      newData
    );
    setUserTableData([...userTableData, data]);
  };

  const removeUser = async (id) => {
    await axios.delete(`https://jsonplaceholder.typicode.com/users/${id}`);
    const updatedTableData = userTableData.filter((user) => user.id !== id);
    setUserTableData(updatedTableData);
  };

  const updateUser = async (id, newData) => {
    const { data } = await axios.put(
      `https://jsonplaceholder.typicode.com/users/${id}`,
      newData
    );
    const updatedUserList = userTableData.map((user) => {
      if (user.id === id) {
        return data;
      } else {
        return user;
      }
    });

    setUserTableData(updatedUserList);
  };

  useEffect(() => {
    setLoading(true);
    const getUsers = async () => {
      const { data } = await axios.get(
        "https://jsonplaceholder.typicode.com/users"
      );
      setUserTableData(data);
      setLoading(false);
    };

    getUsers();
  }, []);

  return (
    <div style={{ maxWidth: "100%", textAlign: "center" }}>
      {loading ? (
        <h2>Loading.....</h2>
      ) : (
        <MaterialTable
          title="User Table"
          columns={userTableColumns}
          data={userTableData}
          editable={{
            onRowAdd: (newData) =>
              new Promise((resolve, reject) => {
                setTimeout(() => {
                  addUser(newData);
                  resolve();
                }, 1000);
              }),
            onRowUpdate: (newData, oldData) =>
              new Promise((resolve, reject) => {
                setTimeout(() => {
                  updateUser(oldData.id, newData);
                  resolve();
                }, 1000);
              }),
            onRowDelete: (oldData) =>
              new Promise((resolve, reject) => {
                setTimeout(() => {
                  removeUser(oldData.id);
                  resolve();
                }, 1000);
              }),
          }}
          cellEditable={{
            onCellEditApproved: (newValue, oldValue, rowData, columnDef) => {
              return new Promise((resolve, reject) => {
                setTimeout(() => {
                  const newData = rowData;
                  newData[columnDef.field] = newValue;
                  updateUser(rowData.id, newData);
                  resolve();
                }, 1000);
              });
            },
          }}
        />
      )}
    </div>
  );
};

export default UserTable;
