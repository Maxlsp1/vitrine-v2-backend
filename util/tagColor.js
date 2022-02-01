let color = ''

function tagColor(status){
    switch (status) {
        case 'Brouillon':
            color = 'orange'
            break;
        case 'Proposé':
            color = 'lime'
            break;
        case 'Actif':
            color = 'green'
            break;
        case 'Terminé':
            color = 'red'
            break;
        default:
            color = "blue"
            break;
    }
    return color
}

exports.tagColor = tagColor