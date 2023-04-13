import React, { useState, useEffect } from "react";

const App = () => {
  const [tabs, setTabs] = useState(() => {
    const storedTabs = localStorage.getItem("tabs");
    return storedTabs ? JSON.parse(storedTabs) : [];
  });
  const [activeTab, setActiveTab] = useState(null);
  const [newTabName, setNewTabName] = useState("");

  useEffect(() => {
    const storedTabs = localStorage.getItem("tabs");
    if (storedTabs) {
      setTabs(JSON.parse(storedTabs));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("tabs", JSON.stringify(tabs));
  }, [tabs]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleTabDelete = (tab) => {
    if (window.confirm(`Are you sure you want to delete "${tab.name}"?`)) {
      const newTabs = tabs.filter((t) => t !== tab);
      setTabs(newTabs);
      setActiveTab(null);
    }
  };

  const handleNewTab = () => {
    if (newTabName !== "") {
      const newTabs = [...tabs, { name: newTabName, items: [] }];
      setTabs(newTabs);
      setActiveTab(newTabs[newTabs.length - 1]);
      setNewTabName("");
    }
  };

  const handleNewItem = (name, value) => {
    const newItems = [...activeTab.items, { name, value: 0 }];
    const newTab = { ...activeTab, items: newItems };
    const newTabs = tabs.map((t) => (t === activeTab ? newTab : t));
    setTabs(newTabs);
    setActiveTab(newTab);
  };

  const handleItemEdit = (itemIndex, name, value) => {
    const newItems = activeTab.items.map((item, i) =>
      i === itemIndex ? { ...item, name, value } : item
    );
    const newTab = { ...activeTab, items: newItems };
    const newTabs = tabs.map((t) => (t === activeTab ? newTab : t));
    setTabs(newTabs);
    setActiveTab(newTab);
  };

  const handleItemDelete = (itemIndex) => {
    if (window.confirm(`Are you sure you want to delete this item?`)) {
      const newItems = activeTab.items.filter((item, i) => i !== itemIndex);
      const newTab = { ...activeTab, items: newItems };
      const newTabs = tabs.map((t) => (t === activeTab ? newTab : t));
      setTabs(newTabs);
      setActiveTab(newTab);
    }
  };

  const handleTabNameChange = (e) => {
    const newTab = { ...activeTab, name: e.target.value };
    const newTabs = tabs.map((t) => (t === activeTab ? newTab : t));
    setTabs(newTabs);
    setActiveTab(newTab);
  };

  const handleNewTabNameChange = (e) => {
    setNewTabName(e.target.value);
  };

  const handleOverallTotal = () => {
    let total = 0;
    tabs.forEach((tab) => {
      let tabTotal = 0;
      tab.items.forEach((item) => {
        tabTotal += parseFloat(item.value) || 0;
      });
      total += tabTotal;
    });
    return total;
  };

  return (
    <div>
      <div>
        {tabs.map((tab, i) => (
          <div key={i}>
            <button onClick={() => handleTabClick(tab)}>{tab.name}</button>
            <button onClick={() => handleTabDelete(tab)}>Delete</button>
          </div>
        ))}
        <div>
          <input
            type="text"
            value={newTabName}
            onChange={handleNewTabNameChange}
            placeholder="New Tab Name"
          />
          <button onClick={handleNewTab}>Add Tab</button>
        </div>
      </div>
      {activeTab && (
        <div>
          <h2>{activeTab.name}</h2>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Value</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {activeTab.items.map((item, i) => (
                <tr key={i}>
                  <td>
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) =>
                        handleItemEdit(i, e.target.value, item.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={item.value}
                      onChange={(e) =>
                        handleItemEdit(i, item.name, e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <button onClick={() => handleItemDelete(i)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div>
            <input
              type="text"
              onChange={handleTabNameChange}
              value={activeTab.name}
            />
          </div>
          <div>
            <button onClick={() => handleNewItem("", "")}>Add Item</button>
          </div>
          <div>
            Total:{" "}
            {activeTab.items.reduce(
              (total, item) => total + parseFloat(item.value),
              0
            )}
          </div>
        </div>
      )}
      <div>Overall Total: {handleOverallTotal()}</div>
    </div>
  );
};

export default App;
