package main

import (
	"encoding/json"
	"fmt"
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

func main() {
	file, err := ioutil.ReadFile("./config.json")
	if err != nil {
		fmt.Println(err)
	}
	err = json.Unmarshal(file, &config)
	if err != nil {
		println(err)
		return
	}
	client := irc.SimpleClient(config.Nick)
	client.AddHandler("connected", connected)
	client.AddHandler("disconnected", disconnected)
	quit := make(chan bool)
	err = client.Connect(config.Server)
	if err != nil {
		fmt.Printf("Connection Error: %s\n", err)
	}
	<-quit
}

func connected(conn *irc.Conn, line *irc.Line) {
	conn.Pass(config.Password)
	conn.Join(config.Channel)
	conn.Privmsg(config.Channel, "Chévere")
}

func disconnected(conn *irc.Conn, line *irc.Line) {
	println("Disconnected")
}
