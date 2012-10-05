package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"
	irc "github.com/fluffle/goirc/client"
	"io/ioutil"
)

type Config struct {
	Nick     string
	Password string
	Server   string
	Channel  string
}

var config Config

func readConfig(filename string) {
	defer println("Reading Config at: " + filename)
	file, err := ioutil.ReadFile(filename)
	if err != nil {
		println(err)
		return
	}
	err = json.Unmarshal(file, &config)
	if err != nil {
		println(err)
		return
	}
}

func main() {
	readConfig("./config.json")
	client := irc.SimpleClient(config.Nick)
	client.AddHandler("connected", connected)
	client.AddHandler("disconnected", disconnected)
	quit := make(chan bool)
	err := client.Connect(config.Server)
	if err != nil {
		fmt.Printf("Connection Error: %s\n", err)
	}
	<-quit
}

func connected(conn *irc.Conn, line *irc.Line) {
	println("Connected!")
	//conn.Pass(config.Password)
	//conn.Join(config.Channel)
	//conn.Privmsg(config.Channel, "Chévere")
	readTwitter(conn, line)
}

func disconnected(conn *irc.Conn, line *irc.Line) {
	println("Disconnected")
}

func readTwitter(conn *irc.Conn, line *irc.Line) {
	// Twitter Fetch
	resp, err := http.Get("http://api.twitter.com/1/statuses/user_timeline.json?screen_name=OpenVE")
	if err != nil {
		println(err)
	}
	body, err := ioutil.ReadAll(resp.Body)
	resp.Body.Close()
	fmt.Printf("%v\n", string(body))
	c := time.Tick(1 * time.Minute)
	for now := range c {
		fmt.Printf("%v\n", now, resp)
	}
}
