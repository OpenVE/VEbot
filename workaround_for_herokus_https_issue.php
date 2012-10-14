<?
// This needs to be on a separated server
// The reason for this file is that Heroku has an issue
// with outgoing https requests.
$url = 'https://github.com/organizations/OpenVE/sadasant.private.atom?token='; // Change the user and add your token.
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
$result = curl_exec($ch);
echo substr($result, 0, count($result) - 1); // By default it adds a "1" at the end of the response.
curl_close($ch);
?>
