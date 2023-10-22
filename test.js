













// destructure precisa ter bind
// f retorna os operadores.

and(({ f }) => {
    or(() => {
        f('lang').eq.v('en');
        f('lang').eq.v('de');
        f('lang').eq.v('fr');
    });

    f('olang').not.v('ja');
    f('release').eq.and(() => {
        f('release').gte.v('2020-01-01');
        f('producer').eq.f('id').eq.v('p30');
    });
})




