from csv import DictReader
import argparse

COLUMN_NAMES = {
    'Stream Title':'title',
    'Stream Link':'link',
    'Category':'category',
    'Description (optional)':'description',
    'Channel or Handle':'channel',
    'Platform':'platform',
    'Description Page Link (optional)':'description-link',
    'Donation Page Link (optional)':'donation-link',
    'Start time':'start-time',
    'End time (optional)':'end-time',
    'Duration (optional)':'duration'
}

def unpack(f):
    for row in DictReader(f):
        new = {}
        for k,v in row.items():
            new[COLUMN_NAMES[k]] = v
        yield new

def main():
    parser = argparse.ArgumentParser(
        description='Generate jekyll and js friendly data files for google sheet stream links.')

    parser.add_argument('csv_file', metavar='f', type=str,
                    help='Path to csv exported from gogle docs.')
    args = parser.parse_args()


    f = open(args.csv_file)
    col = list(unpack(f))
    print("Loaded {} records from `{}`".format(len(col),args.csv_file))


main()