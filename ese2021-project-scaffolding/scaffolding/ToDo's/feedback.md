#Feedback des Assistenten
## Zu erledigen: 
1. Werte für CSS-Properties (z.B. eine Farbe wie YB-Gelb), das vielerorts verwendet wird aber schlecht «vererbt» werden 
kann, kann in CSS-Variablen gespeichert werden.

3. AppModule: Module von AngularMaterial könnten in separatem AngularMaterialModule importiert werden, so muss dann 
nur dieses AngularMaterialModule im AppModule importiert werden.
4. Non-Null Assertion Operator für Objekte verwenden, die nicht zwingend «leer» instanziert werden müssen. Z.B. product 
im ShopItemComponent wird immer einen Wert durch @Input erhalten da der Component sonst gar nicht existieren würde. Man 
braucht product also nicht «leer» zu instanzieren aber kann dafür schreiben:
product!: Product;
Dies besagt, dass die Variable product zu diesem Zeitpunkt nicht NULL sein wird. Falls man Szenarien hat, bei denen die
Variable dennoch NULL sein könnte (z.B. eine User Variable weil User entweder eingeloggt ist oder nicht) und man dies 
während run-time prüfen muss, kann man ? verwenden. z.B.
user?.userId;
Falls «user» nicht existiert wird auch nicht auf seine userId Property zugegriffen, die zu einem Fehler führen würde.
5. Für TypeScript gibt es TypeDoc (ähnlich wie JavaDoc bei Java).
6. Inline-CSS vermeiden
7. Bemerkungen/Verbesserungsvorschläge der IDEs beachten
8. Ablauf von Registrierung und Login könnte noch verbessert werden: Mehr User-Feedback geben; nach Registrierung gleich 
einloggen; sobald eingeloggt auf Home weiterleiten etc.
9. Für besseres UserFeedback können Packages wie ngx-toastr verwendet werden
10. Registrierung mit leerer E-Mail ist zurzeit noch möglich. Gleiches gilt für leeren Usernamen.
11. Bug: Post erstellen mit Titel, Text und Bild aber ohne Kategorie hängt sich auf und läuft nicht weiter. Zu diesem 
Zeitpunkt kann man auch endlos viele Up- und Downvotes machen.
12. PostComponent relativ umfangreich/komplex. Bei einer anderen Struktur der Seite hätte man separate Components für 
«ViewPost» und «EditPost» erstellen können, da bei euch aber alles gleich im Feed editiert wird, ist es i.O.
13. Wiederverwendung von einzelnen Funktionen teils schwierig da sie direkt im Component implementiert wurden. Falls 
App umfangreicher werden würde, müssten diese dann noch in Services ausgelagert werden, damit der Code wiederverwendet werden kann und nicht dupliziert werden muss.

## Erledigt:
2. In «index.html» können title und favicon der App/Webseite angepasst werden (beeinflusst im Browser den Titel
   und das Icon des Tabs) **erledigt**