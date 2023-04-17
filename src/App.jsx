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
      console.log(tabs);
      console.log(activeTab);
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
    <main>
      <img className="imageBG" src="starDreamcatcherBG.jpg" />
      <section className="tabsSection">
        <div className="tabs">
          {tabs.map((tab, i) => (
            <div key={i}>
              <button className="tab" onClick={() => handleTabClick(tab)}>
                {tab.name}
              </button>
            </div>
          ))}
        </div>
        <div>
          <input
            className="tabNameInput"
            type="text"
            value={newTabName}
            onChange={handleNewTabNameChange}
            placeholder="New Product"
          />
          <div>
            <button className="addTab" onClick={handleNewTab}>
              Add Product
            </button>
          </div>
        </div>
      </section>
      {activeTab && (
        <div>
          <h2 className="productName">{activeTab.name}</h2>
          <div className="tabNameChange">
            <input
              type="text"
              onChange={handleTabNameChange}
              value={activeTab.name}
            />
            <button
              className="deleteTab"
              onClick={() => handleTabDelete(activeTab)}
            >
              Delete
            </button>
          </div>
          <div className="itemsSection">
            <div className="itemsTitle">
              <h3>Current Items</h3>
            </div>
            {activeTab.items.map((item, i) => (
              <div className="singleItem">
                <input
                  key={i}
                  type="text"
                  value={item.name}
                  onChange={(e) =>
                    handleItemEdit(i, e.target.value, item.value)
                  }
                  placeholder="Item Name"
                />
                <input
                  key={i}
                  type="number"
                  value={item.value}
                  onChange={(e) => handleItemEdit(i, item.name, e.target.value)}
                />
                <button
                  className="itemDelete"
                  key={i}
                  onClick={() => handleItemDelete(i)}
                >
                  Delete
                </button>
              </div>
            ))}
            {/* <div className="itemsNames">
              <h3>Name</h3>
              {activeTab.items.map((item, i) => (
                <input
                  key={i}
                  type="text"
                  value={item.name}
                  onChange={(e) =>
                    handleItemEdit(i, e.target.value, item.value)
                  }
                />
              ))}
            </div> */}
            {/* <div className="itemsPrices">
              <h3>Price</h3>
              {activeTab.items.map((item, i) => (
                <input
                  key={i}
                  type="number"
                  value={item.value}
                  onChange={(e) => handleItemEdit(i, item.name, e.target.value)}
                />
              ))}
            </div> */}
            {/* <div className="itemsDelete">
              {activeTab.items.map((item, i) => (
                <button
                  className="itemDelete"
                  key={i}
                  onClick={() => handleItemDelete(i)}
                >
                  Delete
                </button>
              ))}
            </div> */}
          </div>
          <div>
            <button className="addItem" onClick={() => handleNewItem("", "")}>
              Add Item
            </button>
          </div>
          <section className="tabTotal">
            <h1>
              Total:{" $"}
              {Number(
                activeTab.items
                  .reduce((total, item) => total + parseFloat(item.value), 0)
                  .toFixed(2)
              )}
            </h1>
          </section>
        </div>
      )}
      <h1>Overall Total: ${handleOverallTotal().toFixed(2)}</h1>
    </main>
  );
};

export default App;
