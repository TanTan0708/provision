function Bigdiv(){
    return(
        <div className="bigdiv">
            <div className="sidebar">
                <div className="rectangle"></div>
                <div className="circle"><p>3</p></div>
                <img src="src/assets/provisionlogo.png" alt="" className="logo"/>
                <img src="src/assets/bell.png" alt="" className="bell"/>
                <img src="src/assets/home.png" alt="" className="home" />
                <p className="hometext">Home</p>
                <img src="src/assets/speechbubble.png" alt="" className="speechbubble" />
                <p className="speechbubbletext">Messages</p>
                <img src="src/assets/orders.png" alt="" className="orders" />
                <p className="orderstext">Orders</p>
                <div className="rectangle2"></div>
                <img src="src/assets/statistics.png" alt="" className="statistics" />
                <p className="statisticstext">Statistics</p>
                <div className="line"></div>
                <img src="src/assets/exit.png" alt="" className="exit" />
            </div>
            <div className="header">
                <div className="headertext">
                    <h3 className="firstheadertext">
                        Forecast
                    </h3>
                    <p className="secondheadertext">
                        Company Name
                    </p>
                </div>
                <div className="greenhome">
                    <img src="src/assets/greenhome.png" alt="" className="greenhomepic" />
                    <div className="backtodashboard">
                        <p>Back To Dashboard</p>
                    </div>
                    
                </div>
            </div>
        </div>
    ); 
}

export default Bigdiv