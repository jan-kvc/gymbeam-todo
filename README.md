#Na co som natrafil:

1. [Api](https://mockapi.io/) free dovoluje len 2 tabulky, takze som nemohol urobit relacie medzi userom, listami a zaroven todo itemami, preto to je poriesene tak, ze listy maju len array todo itemov, nevedel som ci mozem pouzit ine free api ako zadane napr supabase alebo firebase. Obmedzene api, musim tahat data naraz, neviem zavolat todoItems iba pre konkretny list atd. Preto si vsade posielam cele listy, lebo musim updatovat array column v tabulke, nie jednotlive riadky..

2. Pre vacsiu appku, a pri lepsom api by som pouzil react-query na server state management s pagination atd., alebo zustand na lokalny state ktory by sa synchronizoval s DB.

3. Pri zisteni toho ze casto posielam tie iste data do komponentov z dovodu obmedzenia api, by som vytvoril kontext/zustand state na tie data
